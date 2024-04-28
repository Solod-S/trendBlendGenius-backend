import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { NewsService } from '@common/services/newsService/newsService';

@Injectable()
export class ArticlesService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly userService: UsersService,
        private readonly newsService: NewsService,
    ) {}

    async add(id: string) {
        console.log(`id`, id);
        // const newArticle = await this.prismaService.token.create(dto);

        const articleData = {
            title: 'title',
            content: 'content',
            description: 'description',
            author: 'author',
            urlToImage: 'urlToImage',
            url: 'url',
            source: 'source',
            publishedAt: 'publishedAt',
        };
        const user = await this.userService.findOne(id);
        if (!user) {
            throw new UnauthorizedException(``);
        }

        const { openAIkey, newsApiKey, newsCategory, query, language, country } = user;
        console.log(openAIkey, newsApiKey);
        if (!openAIkey || !newsApiKey) {
            throw new UnauthorizedException('OpenAI API key is missing');
        }

        const params: any = { sortBy: 'relevancy', page: 2 };
        if (query) params.q = query;
        if (language) params.language = language;
        // if (country) params.country = country;
        // if (newsCategory) params.category = newsCategory;

        const newsData = await this.newsService.searchEverything(newsApiKey, params);
        const { source, author, title, description, url, urlToImage, content, publishedAt } = newsData.articles[0];
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
        console.log(`newArticle`, newArticle);
        return newsData;
    }
}
