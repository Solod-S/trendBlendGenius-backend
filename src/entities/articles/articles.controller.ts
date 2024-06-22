import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@common/decorators';

import { ArticlesService } from './articles.service';
import { createAtrticleDto } from './dto';
import {
    CREATE_ARTICLE_BAD_RESPONSE,
    CREATE_ARTICLE_NOT_FOUND_RESPONSE,
    CREATE_ARTICLE_RESPONSE,
    CREATE_ARTICLE_UNAUTHORIZED_RESPONSE,
    DELETE_ARTICLE_BY_ID_RESPONSE,
    DELETE_ARTICLE_ID_FORBIDDEN_RESPONSE,
    DELETE_ARTICLE_ID_NOT_FOUND_RESPONSE,
    GET_ARTICLES_FORBIDDEN_RESPONSE,
    GET_ARTICLES_RESPONSE,
    GET_ARTICLES_UNAUTHORIZED_RESPONSE,
    GET_ARTICLE_BY_ID_FORBIDDEN_RESPONSE,
    GET_ARTICLE_BY_ID_NOT_FOUND_RESPONSE,
    GET_ARTICLE_BY_ID_RESPONSE,
    GET_ARTICLE_BY_ID_UNAUTHORIZED_RESPONSE,
} from './entities/articles.entity';
import { JwtPayload } from '@auth/interfaces';

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
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Not found',
        type: CREATE_ARTICLE_NOT_FOUND_RESPONSE,
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
        type: GET_ARTICLES_UNAUTHORIZED_RESPONSE,
        isArray: false,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Forbidden',
        type: GET_ARTICLES_FORBIDDEN_RESPONSE,
        isArray: false,
    })
    @Get('')
    async getAllArticles(
        @Query('userId') userId: string,
        @Query('page') page: number = 1,
        @Query('perPage') perPage: number = 10,
        @CurrentUser() user: JwtPayload,
    ) {
        const pageNumber = Number(page);
        const perPageNumber = Number(perPage);

        const { articles, totalCount } = await this.articleService.getAllArticles(
            userId,
            user,
            pageNumber,
            perPageNumber,
        );
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

    //GET LAST WEEK ARTICLES
    @Get('/lastweek')
    async getLastArticles(@Query('userId') userId: string, @CurrentUser() user: JwtPayload) {
        const data = await this.articleService.getLasArticles(userId, user);
        return {
            message: 'Successful request',
            data,
            statusCode: 200,
        };
    }

    //GET ARTICLES OVERVIEW
    @Get('/articles-overview')
    async getArticlesOverview(@Query('userId') userId: string, @CurrentUser() user: JwtPayload) {
        const data = await this.articleService.geArticlesOverview(userId, user);
        return {
            message: 'Successful request',
            data,
            statusCode: 200,
        };
    }

    //GET ARTICLE BY ID
    @ApiOperation({ summary: 'Get article by id' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: GET_ARTICLE_BY_ID_RESPONSE,
        isArray: false,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized',
        type: GET_ARTICLE_BY_ID_UNAUTHORIZED_RESPONSE,
        isArray: false,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Forbidden',
        type: GET_ARTICLE_BY_ID_FORBIDDEN_RESPONSE,
        isArray: false,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Not found',
        type: GET_ARTICLE_BY_ID_NOT_FOUND_RESPONSE,
        isArray: false,
    })
    @Get('/:artId')
    async getAllArticleById(@Param('artId') artId: string, @CurrentUser() user: JwtPayload) {
        const article = await this.articleService.getAllArticleById(user, artId);
        return {
            message: 'Successful request',
            data: article,
            statusCode: 200,
        };
    }
    //DELETE ARTICLE BY ID
    @Delete('delete/:artId')
    @ApiOperation({ summary: 'Delete article by id' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: DELETE_ARTICLE_BY_ID_RESPONSE,
        isArray: false,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Forbidden',
        type: DELETE_ARTICLE_ID_FORBIDDEN_RESPONSE,
        isArray: false,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Not found',
        type: DELETE_ARTICLE_ID_NOT_FOUND_RESPONSE,
        isArray: false,
    })
    async deleteUser(@Param('artId') artId: string, @CurrentUser() user: JwtPayload) {
        await this.articleService.deleteArticleById(user, artId);
        return {
            message: 'Successful request',
            statusCode: 204,
        };
    }
}
