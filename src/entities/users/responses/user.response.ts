import { Provider } from '@prisma/client';
import { Role, User, NewsCategories, Languages, Countries } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponse implements User {
    id: string;
    email: string;
    newsCategory: NewsCategories[];
    language: Languages[];
    country: Countries[];
    query: string;

    @Exclude()
    // исключаем
    password: string;

    @Exclude()
    // исключаем
    createdAt: Date;

    @Exclude()
    // исключаем
    provider: Provider;

    @Exclude()
    isBlocked: boolean;

    @Exclude()
    openAIkey: string;

    @Exclude()
    newsApiKey: string;

    updatedAt: Date;
    roles: Role[];

    constructor(user: User) {
        Object.assign(this, user);
    }
}
