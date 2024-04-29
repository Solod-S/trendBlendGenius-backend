import { Module } from '@nestjs/common';
import { OpenAIService } from './openaiService.service';

@Module({
    providers: [OpenAIService],
    exports: [OpenAIService],
})
export class OpenAIModule {}
