import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { UsersModule } from './entities/users/users.module';
import { AuthModule } from './entities/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ArticlesModule } from './entities/articles/articles.module';

@Module({
    imports: [AuthModule, UsersModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true }), ArticlesModule],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
