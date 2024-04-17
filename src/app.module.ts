import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '@prisma/prisma.module';
import { UsersModule } from './entities/users/users.module';
import { AuthModule } from './entities/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [UsersModule, PrismaModule, AuthModule, ConfigModule.forRoot({ isGlobal: true })],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
