import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { User } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { genSaltSync, hashSync } from 'bcrypt';
import { convertToSecondsUtil } from '@common/utils';

@Injectable()
export class UsersService {
    constructor(
        private readonly prismaService: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        // https://docs.nestjs.com/techniques/caching
        private readonly configService: ConfigService,
    ) {}

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
}
