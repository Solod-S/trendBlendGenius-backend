import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    providers: [UsersService],
    exports: [UsersService],
    controllers: [UsersController],
    imports: [CacheModule.register()],
})
export class UsersModule {}
