import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
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
            });
        const refreshToken = await this.getRefreshToken(user.id, agent);
        return { accessToken, refreshToken };
    }

    async register(dto: RegisterDto) {
        try {
            const user: User = await this.userService.findOne(dto.email);
            if (user) {
                throw new ConflictException(`User with such email: ${dto.email} already exists`);
            }
            const newUser = await this.userService.save(dto);
            return newUser;
        } catch (err) {
            console.log(`Error in user find`, err);
            this.logger.error(err);
            return null;
        }
    }

    async login(dto: LoginDto, agent: string): Promise<Tokens> {
        try {
            const user: User = await this.userService.findOne(dto.email, true);
            if (!user || !compareSync(dto.password, user.password)) {
                throw new UnauthorizedException(`Wrong password or email`);
            }
            const tokens = await this.generateTokens(user, agent);
            return tokens;
        } catch (err) {
            console.log(`Error in user find`, err);
            this.logger.error(err);
            return null;
        }
    }
}
