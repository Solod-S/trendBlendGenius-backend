import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { UsersModule } from '../users/users.module';
import { newsServiceModule } from '@common/services/newsService/newsService.module';

@Module({
    providers: [ArticlesService],
    controllers: [ArticlesController],
    imports: [UsersModule, newsServiceModule],
})
export class ArticlesModule {}
