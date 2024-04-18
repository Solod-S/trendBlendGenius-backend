import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { options } from './config';

@Module({
    providers: [AuthService],
    controllers: [AuthController],
    imports: [JwtModule.registerAsync(options()), UsersModule, HttpModule],
})
export class AuthModule {}
