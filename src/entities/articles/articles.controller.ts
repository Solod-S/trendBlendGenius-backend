import { Body, Controller, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@common/decorators';

import { ArticlesService } from './articles.service';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
    constructor(
        private readonly articleService: ArticlesService,
        private readonly configService: ConfigService,
    ) {}

    //CREATE ARTICLE
    @Post('create')
    async createArticle(
        @Body()
        params: any,
        @CurrentUser('id') id: string,
    ) {
        const { domain } = params;
        return this.articleService.createNewArticle(id, domain);
    }
}
