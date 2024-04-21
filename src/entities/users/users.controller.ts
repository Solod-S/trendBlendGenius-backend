import { JwtPayload } from '@auth/interfaces';
import { CurrentUser, Roles } from '@common/decorators';
import {
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    UseInterceptors,
    ClassSerializerInterceptor,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponse } from './responses';
import { RolesGuard } from 'src/guards/role.guard';
import { Role } from '@prisma/client';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':idOrEmail')
    async findOneUser(@Param('idOrEmail') idOrEmail: string) {
        console.log(`idOrEmail`, idOrEmail);
        const user = await this.userService.findOne(idOrEmail);
        return new UserResponse(user);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    async me(@CurrentUser('email') email: string) {
        const user = await this.userService.findOne(email);
        return new UserResponse(user);
    }

    @Delete('delete/:id')
    async deleteUser(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
        // @CurrentUser('id') userId: string - then just take the ID
        // ParseUUIDPipe - if the string is not uuid it will give an error

        return this.userService.delete(id, user);
    }
}
