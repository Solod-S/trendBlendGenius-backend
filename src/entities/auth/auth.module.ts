import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { options } from './config';
import { CacheModule } from '@nestjs/cache-manager';
import { STRTAGIES } from 'src/strategies';
import { GUARDS } from 'src/guards';
import { PassportModule } from '@nestjs/passport';

@Module({
    controllers: [AuthController],
    providers: [AuthService, ...STRTAGIES, ...GUARDS],
    imports: [PassportModule, JwtModule.registerAsync(options()), UsersModule, HttpModule, CacheModule.register()],
})
export class AuthModule {}
