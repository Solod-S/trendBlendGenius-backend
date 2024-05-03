import { JwtPayload, Tokens } from '@auth/interfaces';
import { CurrentUser, Roles, UserАgent } from '@common/decorators';
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
    Put,
    Body,
    UnauthorizedException,
    BadRequestException,
    Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponse } from './responses';
import { RolesGuard } from 'src/guards/role.guard';
import { Role, User } from '@prisma/client';
import { ApiOperation, ApiResponse, ApiTags, ApiSecurity, ApiBody } from '@nestjs/swagger';

import {
    GET_USER_BY_IDorEMAIL_FORBIDDEN_RESPONSE,
    GET_USER_BY_IDorEMAIL_RESPONSE,
    GET_YOUR_DATA_RESPONSE,
    GET_YOUR_DATA_UNAUTHORIZED_RESPONSE,
    GET_YOUR_DATA_FORBIDDEN_RESPONSE,
    UPDATE_YOUR_DATA_RESPONSE,
    UPDATE_YOUR_DATA_UNAUTHORIZED_RESPONSE,
    UPDATE_YOUR_DATA_RESPONSE_BAD_RESPONSE,
} from '@auth/entities/auth.entity';
import { updateUserDto } from '@auth/dto';
import { Response } from 'express';
import { REFRESH_TOKEN } from '@common/constants';
import { ConfigService } from '@nestjs/config';
import { transformUser } from '@common/utils';

@ApiTags('Users')
@ApiSecurity('JWT', ['JWT'])
@Controller('users')
export class UsersController {
    constructor(
        private readonly userService: UsersService,
        private readonly configService: ConfigService,
    ) {}

    private setRefreshTokenTocookies(tokens: Tokens, res: Response, user: User) {
        if (!tokens) {
            throw new UnauthorizedException();
        }

        res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(tokens.refreshToken.exp),
            secure: this.configService.get('NODE_ENV', 'development') === 'production',
            path: '/',
        });

        // set up cookies
        // httpOnly: true  - cancel access from the js console
        // sameSite: 'lax' - all requests must be sent from the same site
        // expires: new Date(tokens.refreshToken.exp) - the lifetime is taken from the token
        // secure: true - only via https (we set it to be fels for development, true for product)
        // path: '/', where cookies are available (path: '/' - available on all pages)

        res.status(HttpStatus.OK).json({
            message: 'Successful request',
            accessToken: tokens.accessToken.split(' ')[1],
            user: transformUser(user),
            statusCode: 200,
        });
    }

    //GET USER DATA
    @ApiOperation({ summary: 'Get user by id or email (ONLY FOR ADMIN)' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: GET_USER_BY_IDorEMAIL_RESPONSE,
        isArray: false,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Forbidden',
        type: GET_USER_BY_IDorEMAIL_FORBIDDEN_RESPONSE,
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

    //GET MY DATA
    @ApiOperation({ summary: 'Get your data' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: GET_YOUR_DATA_RESPONSE,
        isArray: false,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized',
        type: GET_YOUR_DATA_UNAUTHORIZED_RESPONSE,
        isArray: false,
    })
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

    //UPDATE USER
    @ApiOperation({ summary: 'Update user' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: UPDATE_YOUR_DATA_RESPONSE,
        isArray: false,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Unauthorized',
        type: UPDATE_YOUR_DATA_RESPONSE_BAD_RESPONSE,
        isArray: false,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized',
        type: UPDATE_YOUR_DATA_UNAUTHORIZED_RESPONSE,
        isArray: false,
    })
    @ApiBody({
        // schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } } },
        schema: {
            type: 'object',
            properties: {
                newsCategory: { type: 'array' },
                query: { type: 'string' },
                language: { type: 'array' },
                country: { type: 'array' },
                newsApiKey: { type: 'string' },
                openAIkey: { type: 'string' },
                password: { type: 'string' },
            },
        },
        examples: {
            example1: {
                value: { newsCategory: ['all'], query: 'AI news', language: ['en'], password: '123456' },
                description: 'User credential data example',
            },
        },
    })
    @Put('/:id')
    async updateUser(
        @Param('id') id: string,
        @Body() body: Partial<updateUserDto>,
        @CurrentUser() user: JwtPayload,
        @UserАgent() agent: string,
        @Res() res: Response,
    ) {
        const { tokens, updatedUser } = await this.userService.update(id, user, body, agent);
        if (!tokens || !updatedUser) {
            throw new BadRequestException();
        }
        this.setRefreshTokenTocookies(tokens, res, updatedUser);
    }

    //DELETE USER
    @ApiOperation({ summary: 'Delete user' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: GET_YOUR_DATA_RESPONSE,
        isArray: false,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized',
        type: GET_YOUR_DATA_UNAUTHORIZED_RESPONSE,
        isArray: false,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Forbidden',
        type: GET_YOUR_DATA_FORBIDDEN_RESPONSE,
        isArray: false,
    })
    @Delete('delete/:id')
    async deleteUser(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
        // @CurrentUser('id') userId: string - then just take the ID
        // ParseUUIDPipe - if the string is not uuid it will give an error

        return this.userService.delete(id, user);
    }
}
