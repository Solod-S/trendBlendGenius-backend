import { Body, Controller, Get, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@common/decorators';
import { JwtPayload } from '@auth/interfaces';
import { ArticlesService } from './articles.service';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
    constructor(
        private readonly articleService: ArticlesService,
        private readonly configService: ConfigService,
    ) {}
    //CREATE ARTICLE
    @Get('create')
    async createArticle(
        // @Body()
        // params: any,
        @CurrentUser('id') id: string,
    ) {
        console.log(`id`, id);
        const articles = await this.articleService.add(id);
        return articles.articles[0];
    }
}
