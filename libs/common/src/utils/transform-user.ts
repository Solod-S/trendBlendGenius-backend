import { User } from '@prisma/client';

export function transformUser(user: User): Partial<User> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, createdAt, provider, openAIkey, newsApiKey, ...rest } = user;
    return rest;
}
