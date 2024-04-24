import { BadRequestException, ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dto';
import { Token, User } from '@prisma/client';
import { Tokens } from './interfaces';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@prisma/prisma.service';
import { v4 } from 'uuid';
import { add } from 'date-fns';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService,
        private readonly userService: UsersService,
    ) {}

    private readonly logger = new Logger(AuthService.name);

    private async getRefreshToken(userId: string, agent: string): Promise<Token> {
        const _token = await this.prismaService.token.findFirst({
            where: {
                userId,
                userAgent: agent,
            },
        });
        const token = _token?.token ?? '';
        return this.prismaService.token.upsert({
            where: { token },
            update: {
                token: v4(),
                exp: add(new Date(), { months: 1 }),
            },
            create: {
                token: v4(),
                exp: add(new Date(), { months: 1 }),
                userId,
                userAgent: agent,
            },
        });
    }

    private async generateTokens(user: User, agent: string): Promise<Tokens> {
        const accessToken =
            'Bearer ' +
            this.jwtService.sign({
                id: user.id,
                email: user.email,
                roles: user.roles,
                newsCategory: user.newsCategory,
                query: user.query,
                language: user.language,
                country: user.country,
            });
        const refreshToken = await this.getRefreshToken(user.id, agent);
        return { accessToken, refreshToken };
    }

    async register(dto: RegisterDto) {
        const user: User = await this.userService.findOne(dto.email);
        if (user) {
            throw new ConflictException(`User with such email: ${dto.email} already exists`);
        }
        const newUser = await this.userService.save(dto);
        return newUser;
    }

    async login(dto: LoginDto, agent: string): Promise<{ tokens: Tokens; user: User }> {
        const user: User = await this.userService.findOne(dto.email, true);
        if (!user || !compareSync(dto.password, user.password)) {
            console.log(0);
            throw new UnauthorizedException(`Wrong password or email`);
        }
        const tokens = await this.generateTokens(user, agent);
        return { tokens, user };
    }

    async getUserFromToken(refreshToken: string) {
        const tokenData = await this.prismaService.token.findUnique({ where: { token: refreshToken } });
        if (!tokenData) {
            throw new BadRequestException();
        }
        const { userId } = tokenData;
        const user = await this.userService.findOne(userId);
        console.log(user);
        return user;
    }

    async refreshTokens(refreshToken: string, agent: string): Promise<Tokens> {
        // 1 - looking for a token
        const token = await this.prismaService.token.findUnique({ where: { token: refreshToken } });
        if (!token) {
            throw new UnauthorizedException();
        }
        // 2 - check if it is ok (if not ok - return an error)
        if (new Date(token.exp) < new Date()) {
            await this.prismaService.token.delete({ where: { token: refreshToken } });
            throw new UnauthorizedException();
        }
        // 3 - delete and return new
        await this.prismaService.token.delete({ where: { token: refreshToken } });
        const user = await this.userService.findOne(token.userId);
        // user => userId
        return this.generateTokens(user, agent);
    }

    async deleteRefreshTokens(token: string) {
        return this.prismaService.token.delete({ where: { token: token } });
    }
}
