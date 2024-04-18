import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    HttpStatus,
    Post,
    Res,
    UnauthorizedException,
    UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserАgent } from '@common/decorators';
import { LoginDto, RegisterDto } from './dto';
import { AuthService } from './auth.service';
import { UserResponse } from '../users/responses';
import { Tokens } from './interfaces';
import { ConfigService } from '@nestjs/config';

const REFRESH_TOKEN = 'refreshtoken';

@UseInterceptors(ClassSerializerInterceptor)
// for UserResponse transformer
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    private setRefreshTokenTocookies(tokens: Tokens, res: Response) {
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

        res.status(HttpStatus.CREATED).json(tokens.accessToken);
    }

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        const user = await this.authService.register(dto);

        if (!user) {
            throw new BadRequestException(`Error registering ${JSON.stringify(dto)}`);
        }
        return new UserResponse(user);
    }

    @Post('login')
    async login(@Body() dto: LoginDto, @Res() res: Response, @UserАgent() agent: string) {
        console.log(`dto`, dto);
        const tokens = await this.authService.login(dto, agent);
        if (!tokens) {
            throw new BadRequestException(`Error login ${JSON.stringify(dto)}`);
        }
        this.setRefreshTokenTocookies(tokens, res);
        // return token and cookies
    }
}
