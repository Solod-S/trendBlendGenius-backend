import { Module, Global } from '@nestjs/common';
import { NewsService } from './newsService';

@Global()
@Module({
    providers: [NewsService], // Добавьте ваш сервис в провайдеры
    exports: [NewsService], // Экспортируйте сервис, если вам это нужно
})
export class newsServiceModule {}
