import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { NewsService } from '@common/services/newsService/newsService.service';
import { OpenAIService } from '@common/services/openaiService/openaiService.service';
import { newsapiArticle } from './dto/newsapiArticle';

@Injectable()
export class ArticlesService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly userService: UsersService,
        private readonly newsService: NewsService,
        private readonly openAI: OpenAIService,
    ) {}

    private async checkArticlesUniqueness(id: string, newArticles: newsapiArticle[]) {
        const oldArticles = await this.prismaService.article.findMany({
            where: { userId: id },
        });
        const articleLinks = oldArticles.map((a) => a.url);
        const filteredArticle = newArticles.filter((art: any) => !articleLinks.includes(art.url));

        console.log(`filteredArticle`, filteredArticle.length);
        return filteredArticle;
    }

    async createNewArticle(id: string) {
        const user = await this.userService.findOne(id);
        if (!user) {
            throw new UnauthorizedException(``);
        }

        const { openAIkey, newsApiKey, query, language } = user;

        if (!openAIkey || !newsApiKey) {
            throw new UnauthorizedException('OpenAI API key is missing');
        }

        const params: any = { sortBy: 'relevancy', page: 2 };
        if (query) params.q = query;
        if (language) params.language = language;

        // Get content from NewsApi
        const newsData = await this.newsService.searchEverything(newsApiKey, params);
        if (newsData.articles.length <= 0) {
            throw new NotFoundException('Content not found');
            //             {
            //     "message": "Content not found",
            //     "error": "Not Found",
            //     "statusCode": 404
            // }
        }

        // Checking whether this content has been found before
        const filteredArticle = await this.checkArticlesUniqueness(id, newsData.articles);

        const { source, author, title, description, url, urlToImage, content, publishedAt } = filteredArticle[0];
        const newArticle = await this.prismaService.article.create({
            data: {
                title,
                content,
                description,
                author,
                urlToImage,
                url,
                source,
                publishedAt,
                userId: user.id,
            },
        });
        // const openAIRESULT = await this.openAI.generateContent(
        //     openAIkey,
        //     content,
        // );

        return newArticle;
    }
}
