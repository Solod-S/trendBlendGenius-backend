import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@common/decorators';

import { ArticlesService } from './articles.service';
import { createAtrticleDto } from './dto';
import {
    CREATE_ARTICLE_BAD_RESPONSE,
    CREATE_ARTICLE_RESPONSE,
    CREATE_ARTICLE_UNAUTHORIZED_RESPONSE,
} from './entities/auth.entity';

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
}
