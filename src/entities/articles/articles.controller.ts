import { Body, Controller, Get, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@common/decorators';

import { ArticlesService } from './articles.service';
import { createAtrticleDto } from './dto';
import {
    CREATE_ARTICLE_BAD_RESPONSE,
    CREATE_ARTICLE_RESPONSE,
    CREATE_ARTICLE_UNAUTHORIZED_RESPONSE,
    GET_ARTICLES_RESPONSE,
} from './entities/articles.entity';

@ApiTags('Articles')
@ApiSecurity('JWT', ['JWT'])
@Controller('articles')
export class ArticlesController {
    constructor(
        private readonly articleService: ArticlesService,
        private readonly configService: ConfigService,
    ) {}

    //CREATE ARTICLE
    @ApiOperation({ summary: 'Create article' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Success', type: CREATE_ARTICLE_RESPONSE, isArray: false })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized',
        type: CREATE_ARTICLE_UNAUTHORIZED_RESPONSE,
        isArray: false,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Request',
        type: CREATE_ARTICLE_BAD_RESPONSE,
        isArray: false,
    })
    @ApiBody({
        schema: { type: 'object', properties: { domain: { type: 'string' } } },
        examples: {
            example1: {
                value: { domain: 'linkedin.com' },
                description: 'Article create params',
            },
        },
    })
    @Post('create')
    async createArticle(
        @Body()
        params: createAtrticleDto,
        @CurrentUser('id') id: string,
    ) {
        const { domain } = params;

        const data = await this.articleService.createNewArticle(id, domain);

        return { message: 'Successful request', data, statusCode: 201 };
    }

    //GET ARTICLES
    @ApiOperation({ summary: 'Get articles' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: GET_ARTICLES_RESPONSE,
        isArray: false,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized',
        type: CREATE_ARTICLE_UNAUTHORIZED_RESPONSE,
        isArray: false,
    })
    @Get('')
    async getAllArticles(
        @Query('page') page: number = 1,
        @Query('perPage') perPage: number = 10,
        @CurrentUser('id') id: string,
    ) {
        const pageNumber = Number(page);
        const perPageNumber = Number(perPage);

        const { articles, totalCount } = await this.articleService.getAllArticles(id, pageNumber, perPageNumber);
        const totalPages = Math.ceil(totalCount / perPageNumber);
        return {
            message: 'Successful request',
            data: articles,
            page,
            perPage,
            totalPages,
            statusCode: 200,
        };
    }
    //GET ARTICLE BY ID

    @Get('/:artId')
    async getAllArticleById(@Param('artId') artId: string, @CurrentUser('id') id: string) {
        console.log(`artId`, artId);
        const article = await this.articleService.getAllArticleById(id, artId);
        return {
            message: 'Successful request',
            data: article,
            statusCode: 200,
        };
    }
}
