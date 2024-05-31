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
        const states = {
            VALIDATE_USER: 'VALIDATE_USER',
            VALIDATE_KEYS: 'VALIDATE_KEYS',
            FETCH_NEWS: 'FETCH_NEWS',
            CHECK_UNIQUENESS: 'CHECK_UNIQUENESS',
            FETCH_HTML: 'FETCH_HTML',
            GENERATE_ARTICLE: 'GENERATE_ARTICLE',
            SAVE_ARTICLE: 'SAVE_ARTICLE',
            COMPLETE: 'COMPLETE',
            ERROR: 'ERROR',
        };

        let currentState = states.VALIDATE_USER;
        let user;
        let articleData;
        let htmlContent;
        let aiContent;
        let result;
        let error;
        let params;
        let articlesArr;

        while (currentState !== states.ERROR) {
            try {
                switch (currentState) {
                    case states.VALIDATE_USER:
                        user = await this.userService.findOne(id, true);

                        if (!user) {
                            throw new UnauthorizedException(`User not found`);
                        }
                        currentState = states.VALIDATE_KEYS;
                        break;

                    case states.VALIDATE_KEYS:
                        if (!user.openAIkey || !user.newsApiKey) {
                            throw new UnauthorizedException('OpenAI API key or NewsAPI key is missing');
                        }
                        if (!user.query) {
                            throw new BadRequestException('Bad request - missing query');
                        }
                        params = { sortBy: 'relevancy', page: 2, q: user.query, language: user.language };
                        currentState = states.FETCH_NEWS;
                        break;

                    case states.FETCH_NEWS:
                        const newsData = await this.newsService.searchEverything(user.newsApiKey, params);
                        if (newsData.articles.length <= 0) {
                            throw new NotFoundException('Content not found');
                        }
                        articleData = newsData.articles;
                        currentState = states.CHECK_UNIQUENESS;
                        break;

                    case states.CHECK_UNIQUENESS:
                        const articles = articleData.filter((art) => !art.url.includes('yahoo'));
                        articlesArr = await this.checkArticlesUniqueness(id, articles);
                        if (articlesArr.length === 0) {
                            throw new NotFoundException('Unique content not found');
                        }
                        articleData = articlesArr[0];
                        currentState = states.FETCH_HTML;
                        break;

                    case states.FETCH_HTML:
                        console.log(`articleData.url`, articleData.url);
                        htmlContent = await this.fetchArticleContent(articleData.url);
                        if (!htmlContent) {
                            articleData = articlesArr.filter((art: any) => art.url !== articleData.url)[0];
                            currentState = states.FETCH_HTML;
                            break;
                        }
                        currentState = states.GENERATE_ARTICLE;
                        break;

                    case states.GENERATE_ARTICLE:
                        console.log(`!!user!!`, user);
                        const config = {
                            tone: user.tone,
                            useEmojis: user.useEmojis,
                            endWithQuestion: user.endWithQuestion,
                        };
                        aiContent = await this.openAI.rewriteArticle(
                            user.openAIkey,
                            htmlContent.textContent,
                            config,
                            domain,
                            articleData.title,
                        );
                        currentState = states.SAVE_ARTICLE;
                        break;

                    case states.SAVE_ARTICLE:
                        const { title, description, author, urlToImage, url, source, publishedAt } = articleData;
                        result = await this.prismaService.article.create({
                            data: {
                                title,
                                content: aiContent,
                                description,
                                html: JSON.stringify(htmlContent),
                                author,
                                urlToImage,
                                url,
                                source,
                                publishedAt,
                                userId: user.id,
                            },
                        });
                        currentState = states.COMPLETE;
                        break;

                    case states.COMPLETE:
                        return result;

                    case states.ERROR:
                        throw error;
                }
            } catch (err) {
                console.error('An error occurred:', err);
                error = err;
                currentState = states.ERROR;
            }
        }

        if (currentState === states.ERROR) {
            throw error;
        }
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

    async getLasArticles(userId: string, user: JwtPayload) {
        if (!user.roles.includes(Role.ADMIN) && user.id !== userId) {
            throw new ForbiddenException();
        }

        const articles = await this.prismaService.article.findMany({
            where: {
                userId: userId,
                createdAt: {
                    gte: new Date(new Date().setDate(new Date().getDate() - 7)),
                },
            },
        });
        // Initialize the number of articles for each day of the week
        const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

        // Initialize the array of days of the week
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const startIndex = daysOfWeek.indexOf(currentDay);
        const orderedDays = [];

        for (let i = 0; i < daysOfWeek.length; i++) {
            orderedDays.push(daysOfWeek[(startIndex - i + daysOfWeek.length) % daysOfWeek.length]);
        }

        // Initialize the number of articles for each day of the week
        const dayCounts = orderedDays.reduce((acc, day) => {
            acc[day] = 0;
            return acc;
        }, {});

        // Count articles by day of the week
        articles.forEach((article) => {
            const dayOfWeek = new Date(article.createdAt).toLocaleDateString('en-US', { weekday: 'long' });
            if (dayCounts[dayOfWeek] !== undefined) {
                dayCounts[dayOfWeek]++;
            }
        });

        // Convert the dayCounts object to the required format
        const response = orderedDays.map((day) => ({
            time: day,
            amount: dayCounts[day],
        }));

        return response;
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
