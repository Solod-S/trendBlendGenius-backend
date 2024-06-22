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

        // Get articles for the last 7 days
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const articles = await this.prismaService.article.findMany({
            where: {
                userId: userId,
                createdAt: {
                    gte: oneWeekAgo,
                },
            },
        });

        const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        // Initialize article counters for each day of the week
        const dayCounts = daysOfWeek.reduce((acc, day) => {
            acc[day] = 0;
            return acc;
        }, {});

        // Count the number of articles for each day of the week
        articles.forEach((article) => {
            const createdAt = new Date(article.createdAt);
            const dayOfWeek = createdAt.toLocaleDateString('en-US', { weekday: 'long' });
            if (dayOfWeek === currentDay) {
                // eliminate duplication of the amount for two “Saturdays” in different numbers
                const currentDate = new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                });
                const articleDate = createdAt.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                });
                if (currentDate === articleDate) {
                    dayCounts[dayOfWeek]++;
                }
            } else {
                // For all other days of the week, we take into account all articles
                dayCounts[dayOfWeek]++;
            }
        });

        // Form the response in the required format
        const response = daysOfWeek.map((day) => ({
            time: day,
            amount: dayCounts[day],
        }));

        return response.reverse();
    }

    async geArticlesOverview(userId: string, user: JwtPayload) {
        if (!user.roles.includes(Role.ADMIN) && user.id !== userId) {
            throw new ForbiddenException();
        }

        // Get the total number of articles for all time
        const totalArticlesCount = await this.prismaService.article.count({
            where: {
                userId: userId,
            },
        });

        // Determine the start of the current month
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

        // Get the number of articles created for the current month
        const monthlyArticlesCount = await this.prismaService.article.count({
            where: {
                userId: userId,
                createdAt: {
                    gte: startOfMonth,
                },
            },
        });

        return {
            totalArticlesCount,
            monthlyArticlesCount,
        };
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
