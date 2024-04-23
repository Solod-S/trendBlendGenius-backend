import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpStatus,
    Post,
    Res,
    UnauthorizedException,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiTags,
    ApiResponse,
    ApiBody,
    ApiOperation,
    ApiCookieAuth,
    // ApiSecurity
} from '@nestjs/swagger';
import { Response } from 'express';
import { Cookies, Public, UserАgent } from '@common/decorators';
import { LoginDto, RegisterDto } from './dto';
import { AuthService } from './auth.service';
import { UserResponse } from '../users/responses';
import { Tokens } from './interfaces';
import { ConfigService } from '@nestjs/config';
import { REFRESH_TOKEN } from '@common/constants';
import {
    REGISTRATION_RESPONSE_BAD_REQUEST,
    REGISTRATION_RESPONSE,
    USER_RESPONSE,
    USER_RESPONSE_UNAUTHORIZED,
    LOGOUT_RESPONSE,
    REFRESH_TOKENS_RESPONSE_UNAUTHORIZED,
    REFRESH_TOKENS_RESPONSE,
} from './entities/auth.entity';
import { User } from '@prisma/client';
import { transformUser } from '@common/utils';

@Public()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
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

    @ApiOperation({ summary: 'Register' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Success', type: REGISTRATION_RESPONSE, isArray: false })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Request',
        type: REGISTRATION_RESPONSE_BAD_REQUEST,
        isArray: false,
    })
    @ApiBody({
        schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } } },
        examples: {
            example1: {
                value: { email: 'test@gmail.com', password: '123456' },
                description: 'User credential data example',
            },
        },
    })
    @UseInterceptors(ClassSerializerInterceptor)
    // for UserResponse transformer
    @Post('register')
    async register(@Body() dto: RegisterDto) {
        const user = await this.authService.register(dto);

        if (!user) {
            throw new BadRequestException(`Error registering ${JSON.stringify(dto)}`);
        }
        return { message: 'Successful request', user: new UserResponse(user), statusCode: 201 };
    }

    @ApiOperation({ summary: 'Login' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: USER_RESPONSE, isArray: false })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized',
        type: USER_RESPONSE_UNAUTHORIZED,
        isArray: false,
    })
    @ApiBody({
        schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } } },
        examples: {
            example1: {
                value: { email: 'test@gmail.com', password: '123456' },
                description: 'User credential data example',
            },
        },
    })
    @Post('login')
    async login(@Body() dto: LoginDto, @Res() res: Response, @UserАgent() agent: string) {
        console.log(`dto`, dto);
        const { tokens, user } = await this.authService.login(dto, agent);
        if (!tokens || !user) {
            console.log(1);
            throw new BadRequestException(`Error login ${JSON.stringify(dto)}`);
        }

        this.setRefreshTokenTocookies(tokens, res, user);
    }

    @ApiOperation({ summary: 'Logout' })
    @ApiCookieAuth(REFRESH_TOKEN)
    @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: LOGOUT_RESPONSE, isArray: false })
    @Get('logout')
    async logout(@Cookies(REFRESH_TOKEN) refreshToken: string, @Res() res: Response) {
        console.log(`request.cookies`);
        if (!refreshToken) {
            res.status(HttpStatus.OK).json({ message: 'Successful request', statusCode: 200 });
            return;
        }
        await this.authService.deleteRefreshTokens(refreshToken);
        res.cookie(REFRESH_TOKEN, '', { httpOnly: true, secure: true, expires: new Date() });
        // clear cookies
        res.status(HttpStatus.OK).json({ message: 'Successful request', statusCode: 200 });
        return;
    }

    @ApiOperation({ summary: 'Refresh-tokens' })
    @ApiCookieAuth(REFRESH_TOKEN)
    @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: REFRESH_TOKENS_RESPONSE, isArray: false })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized',
        type: REFRESH_TOKENS_RESPONSE_UNAUTHORIZED,
        isArray: false,
    })
    @Get('refresh-tokens')
    async refreshTokens(
        @Cookies(REFRESH_TOKEN) refreshToken: string,
        @Res() res: Response,
        @UserАgent() agent: string,
    ) {
        if (!refreshToken) {
            throw new UnauthorizedException();
        }
        const user = await this.authService.getUserFromToken(refreshToken);

        const tokens = await this.authService.refreshTokens(refreshToken, agent);
        if (!tokens || !user) {
            throw new BadRequestException(`Error in refresh tokens`);
        }
        this.setRefreshTokenTocookies(tokens, res, user);
        // return token and cookies
    }
}
