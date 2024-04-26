import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtModule } from '@nestjs/jwt';

import { options } from '@auth/config';

@Module({
    providers: [UsersService],
    exports: [UsersService],
    controllers: [UsersController],
    imports: [CacheModule.register(), JwtModule.registerAsync(options())],
})
export class UsersModule {}
