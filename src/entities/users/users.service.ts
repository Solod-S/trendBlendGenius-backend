import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Role, Token, User } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { genSaltSync, hashSync } from 'bcrypt';
import { convertToSecondsUtil } from '@common/utils';
import { JwtPayload, Tokens } from '@auth/interfaces';
import { updateUserDto } from '@auth/dto';

import { JwtService } from '@nestjs/jwt';
import { v4 } from 'uuid';
import { add } from 'date-fns';

@Injectable()
export class UsersService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        // https://docs.nestjs.com/techniques/caching
        private readonly configService: ConfigService,
    ) {}
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

    private hashPassword(password: string) {
        return hashSync(password, genSaltSync(10));
    }

    async save(user: Partial<User>): Promise<User> {
        const hashedPassword = user?.password ? this.hashPassword(user.password) : null;
        const savedUser = await this.prismaService.user.upsert({
            where: {
                email: user.email,
            },
            update: {
                password: hashedPassword ?? undefined,
                provider: user?.provider ?? undefined,
                roles: user?.roles ?? undefined,
                // isBlocked: user?.isBlocked ?? undefined,
            },
            create: {
                email: user.email,
                password: hashedPassword,
                provider: user?.provider,
                roles: ['USER'],
            },
        });
        await this.cacheManager.set(savedUser.id, savedUser);
        await this.cacheManager.set(savedUser.email, savedUser);
        return savedUser;
    }

    async findOne(idOrEmail: string, isReset = false): Promise<User> {
        if (isReset) {
            // isReset used for Login
            this.cacheManager.del(idOrEmail);
            // if isReset, then we delete user cache
            // from the user’s cache(to write a new one there)
        }
        const user = await this.cacheManager.get<User>(idOrEmail);
        // looks for user in cache
        if (!user) {
            // looks for user in the database, put it in the cache and return it
            const user = await this.prismaService.user.findFirst({
                where: { OR: [{ id: idOrEmail }, { email: idOrEmail }] },
            });

            if (!user) {
                return null;
            }
            const expTime = convertToSecondsUtil(this.configService.get('JWT_EX'));
            await this.cacheManager.set(idOrEmail, user, expTime);
            // key, payload and lifetime
            return user;
        }
        return user;
    }

    async update(id: string, user: JwtPayload, body: Partial<updateUserDto>, agent: string) {
        if (user.id !== id && !user.roles.includes(Role.ADMIN)) {
            throw new ForbiddenException();
        }

        const data: any = {};
        if (body.password) data.password = this.hashPassword(body.password);
        if (body.newsCategory) data.newsCategory = body.newsCategory;
        if (body.query) data.query = body.query;
        if (body.language) data.language = body.language;
        if (body.country) data.country = body.country;
        if (body.newsApiKey) data.newsApiKey = body.newsApiKey;
        if (body.openAIkey) data.openAIkey = body.openAIkey;

        if (Object.keys(data).length === 0) {
            throw new BadRequestException();
        }
        const updatedUser = await this.prismaService.user.update({
            where: { id },
            data, // Update only those fields that come in body
        });
        const tokens = await this.generateTokens(updatedUser, agent);
        return { tokens, updatedUser };
    }

    async delete(id: string, user: JwtPayload) {
        console.log(`user.id !== id`, user.id !== id);
        console.log(`user.id`, user.id);
        console.log(`id`, id);

        if (user.id !== id && !user.roles.includes(Role.ADMIN)) {
            throw new ForbiddenException();
        }
        await Promise.all([this.cacheManager.del(id), this.cacheManager.del(user.email)]);
        return this.prismaService.user.delete({ where: { id }, select: { id: true } });
    }
}
