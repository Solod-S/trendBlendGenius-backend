import { Provider } from '@prisma/client';
import { Role, User, NewsCategories, Languages, Countries } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponse implements User {
    id: string;
    email: string;
    openAIkey: string;
    newsApiKey: string;
    newsCategory: NewsCategories[];
    language: Languages[];
    country: Countries[];

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
    query: string;

    @Exclude()
    isBlocked: boolean;

    updatedAt: Date;
    roles: Role[];

    constructor(user: User) {
        Object.assign(this, user);
    }
}
