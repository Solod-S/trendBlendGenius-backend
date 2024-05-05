import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { NewsService } from '@common/services/newsService/newsService.service';
import { OpenAIService } from '@common/services/openaiService/openaiService.service';

import axios from 'axios';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import { newsapiArticleDto } from './dto';
import { JwtPayload } from '@auth/interfaces';
import { Role } from '@prisma/client';

@Injectable()
export class ArticlesService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly userService: UsersService,
        private readonly newsService: NewsService,
        private readonly openAI: OpenAIService,
    ) {}

    private async checkArticlesUniqueness(id: string, newArticles: newsapiArticleDto[]) {
        const oldArticles = await this.prismaService.article.findMany({
            where: { userId: id },
        });
        const articleLinks = oldArticles.map((a) => a.url);
        const filteredArticle = newArticles.filter((art: any) => !articleLinks.includes(art.url));
        return filteredArticle;
    }

    private async fetchArticleContent(url: string) {
        try {
            const response = await axios.get(url);
            const dom = new JSDOM(response.data, {
                url: url,
            });
            const article = new Readability(dom.window.document).parse();
            return article;
        } catch (error) {
            console.error('Error fetching article content:', error.message);
            return null;
        }
    }

    async createNewArticle(id: string, domain: string) {
        const user = await this.userService.findOne(id);
        if (!user) {
            throw new UnauthorizedException(``);
        }

        const { openAIkey, newsApiKey, query, language, tone, useEmojis, endWithQuestion } = user;

        if (!openAIkey || !newsApiKey) {
            throw new UnauthorizedException('OpenAI API key is missing');
        }

        const params: any = { sortBy: 'relevancy', page: 2 };
        if (query) params.q = query;
        if (!query) {
            throw new BadRequestException('Bad request - missing query');
        }
        if (language) params.language = language;

        // Get content from NewsApi
        const newsData = await this.newsService.searchEverything(newsApiKey, params);
        if (newsData.articles.length <= 0) {
            throw new NotFoundException('Content not found');
        }

        // Checking whether this content has been found before
        const filteredArticle = await this.checkArticlesUniqueness(id, newsData.articles);

        const config = { tone, useEmojis, endWithQuestion };

        const { source, author, title, description, url, urlToImage, publishedAt } = filteredArticle[0];
        // HTML Scraping
        const html = await this.fetchArticleContent(url);
        // Generate new article
        const aiContent = await this.openAI.rewriteArticle(openAIkey, html.textContent, config, domain, title);
        // Saving new article
        const result = await this.prismaService.article.create({
            data: {
                title,
                content: aiContent,
                description,
                html: JSON.stringify(html),
                author,
                urlToImage,
                url,
                source,
                publishedAt,
                userId: user.id,
            },
        });

        return result;
    }

    async getAllArticles(userId: string, user: JwtPayload, page: number, perPage: number) {
        const whereClause: any = { userId: userId };

        if (!user.roles.includes(Role.ADMIN) && user.id !== userId) {
            throw new ForbiddenException();
        }

        const skip = (page - 1) * perPage;
        const take = perPage;
        const [articles, totalCount] = await Promise.all([
            this.prismaService.article.findMany({
                where: whereClause,
                skip,
                take,
            }),
            this.prismaService.article.count({
                where: whereClause,
            }),
        ]);

        return { articles, totalCount };
    }

    async getAllArticleById(user: JwtPayload, artId: string) {
        const article = await this.prismaService.article.findFirst({ where: { id: artId } });

        if (!article) {
            throw new NotFoundException();
        }
        if (user.id !== article.userId && !user.roles.includes(Role.ADMIN)) {
            throw new ForbiddenException();
        }

        return article;
    }
    async deleteArticleById(user: JwtPayload, artId: string) {
        const whereClause: any = { id: artId };

        if (!user.roles.includes(Role.ADMIN)) {
            whereClause.userId = user.id;
        }

        const articleToDelete = await this.prismaService.article.findUnique({ where: whereClause });

        if (!articleToDelete) {
            throw new NotFoundException();
        }

        const delArticle = await this.prismaService.article.delete({ where: { id: artId } });

        return delArticle;
    }
}
