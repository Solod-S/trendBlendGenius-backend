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
    HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponse } from './responses';
import { RolesGuard } from 'src/guards/role.guard';
import { Role } from '@prisma/client';
import { ApiOperation, ApiResponse, ApiTags, ApiSecurity } from '@nestjs/swagger';
import {
    GET_USER_BY_IDorEMAIL_RESPONSE_UNAUTHORIZED,
    GET_USER_BY_IDorEMAIL_RESPONSE,
} from '@auth/entities/auth.entity';

@ApiTags('Users')
@ApiSecurity('JWT', ['JWT'])
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @ApiOperation({ summary: 'Get user by id or email (ONLY FOR ADMIN)' })
    // @ApiSecurity('JWT')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: GET_USER_BY_IDorEMAIL_RESPONSE,
        isArray: false,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized',
        type: GET_USER_BY_IDorEMAIL_RESPONSE_UNAUTHORIZED,
        isArray: false,
    })
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':idOrEmail')
    async findOneUser(@Param('idOrEmail') idOrEmail: string) {
        const user = await this.userService.findOne(idOrEmail);
        return {
            message: 'Successful request',
            user: new UserResponse(user),
            statusCode: 200,
        };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    async me(@CurrentUser('email') email: string) {
        const user = await this.userService.findOne(email);
        return {
            message: 'Successful request',
            user: new UserResponse(user),
            statusCode: 200,
        };
    }

    @Delete('delete/:id')
    async deleteUser(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
        // @CurrentUser('id') userId: string - then just take the ID
        // ParseUUIDPipe - if the string is not uuid it will give an error

        return this.userService.delete(id, user);
    }
}
