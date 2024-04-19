import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { UsersModule } from './entities/users/users.module';
import { AuthModule } from './entities/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
    imports: [UsersModule, PrismaModule, AuthModule, ConfigModule.forRoot({ isGlobal: true })],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
