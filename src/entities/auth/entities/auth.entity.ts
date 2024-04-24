import { ApiProperty } from '@nestjs/swagger';

export class USER_DTO {
    @ApiProperty({ description: 'User ID' })
    id: string;

    @ApiProperty({ description: 'User email' })
    email: string;

    @ApiProperty({ description: 'User roles', isArray: true, type: String })
    roles: string[];

    @ApiProperty({ description: 'User last update date' })
    updatedAt: Date;

    @ApiProperty({ description: 'User OpenAI key', nullable: true })
    openAIkey?: string | null;

    @ApiProperty({ description: 'User news API key', nullable: true })
    newsApiKey?: string | null;

    @ApiProperty({ description: 'User news categories', isArray: true, type: String })
    newsCategory: string[];

    @ApiProperty({ description: 'User preferred languages', isArray: true, type: String })
    language: string[];

    @ApiProperty({ description: 'User preferred countries', isArray: true, type: String })
    country: string[];

    constructor(
        id: string,
        email: string,
        roles: string[],
        updatedAt: Date,
        openAIkey?: string | null,
        newsApiKey?: string | null,
        newsCategory: string[] = [],
        language: string[] = [],
        country: string[] = [],
    ) {
        this.id = id;
        this.email = email;
        this.roles = roles;
        this.updatedAt = updatedAt;
        this.openAIkey = openAIkey;
        this.newsApiKey = newsApiKey;
        this.newsCategory = newsCategory;
        this.language = language;
        this.country = country;
    }
}

export class REGISTRATION_RESPONSE {
    @ApiProperty({
        description: 'Response message',
        nullable: false,
        default: 'Successful request',
    })
    message: string;

    @ApiProperty({ description: 'User information' })
    user: USER_DTO;
    @ApiProperty({
        description: 'Success status',
        nullable: false,
        default: 201,
    })
    statusCode: number;

    constructor(statusCode: number, message: string = '', user: USER_DTO) {
        this.message = message;
        this.user = user;
        this.statusCode = 201;
    }
}

export class REGISTRATION_RESPONSE_BAD_REQUEST {
    @ApiProperty({
        description: 'Response message',
        nullable: false,
        default: 'Error registering {"email","password"}',
    })
    message: string;

    @ApiProperty({
        description: 'Error message',
        nullable: false,
        default: 'Bad Request',
    })
    error: string;
    @ApiProperty({
        description: 'Bad Request',
        nullable: false,
        default: 400,
    })
    statusCode: number;

    constructor(statusCode: number, message: string = '', error: string = '') {
        this.message = message;
        this.error = error;
        this.statusCode = 400;
    }
}

export class USER_RESPONSE {
    @ApiProperty({
        description: 'Response message',
        nullable: false,
        default: 'Successful request',
    })
    message: string;

    @ApiProperty({
        description: 'Access token',
        nullable: false,
        default:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA2ZjVhN2M5LTIyMzYtNDkwNS05NjcyLThmYTA0OWIzMDdmNyIsImVtYWlsIjoidGVzdDExQGdtYWlsLmNvbSIsInJvbGVzIjpbIlVTRVIiLCJBRE1JTiJdLCJuZXdzQ2F0ZWdvcnkiOltdLCJxdWVyeSI6bnVsbCwibGFuZ3VhZ2UiOltdLCJjb3VudHJ5IjpbXSwiaWF0IjoxNzEzNzA3MTM5LCJleHAiOjE3MTQ2NTc1Mzl9.Q_6HqRXw6PfdiweoltxUw8XoQ674mkXlQ13nI0ltwG0',
    })
    accessToken: string;

    @ApiProperty({ description: 'User information' })
    user: USER_DTO;
    @ApiProperty({
        description: 'Success status',
        nullable: false,
        default: 200,
    })
    statusCode: number;

    constructor(statusCode: number, message: string = '', user: USER_DTO, accessToken = '') {
        this.message = message;
        this.accessToken = accessToken;
        this.user = user;
        this.statusCode = 200;
    }
}

export class USER_RESPONSE_UNAUTHORIZED {
    @ApiProperty({
        description: 'Response message',
        nullable: false,
        default: 'Wrong password or email',
    })
    message: string;

    @ApiProperty({
        description: 'Error message',
        nullable: false,
        default: 'Unauthorized',
    })
    error: string;
    @ApiProperty({
        description: 'Unauthorized',
        nullable: false,
        default: 401,
    })
    statusCode: number;

    constructor(statusCode: number, message: string = '', error: string = '') {
        this.message = message;
        this.error = error;
        this.statusCode = 401;
    }
}

export class LOGOUT_RESPONSE {
    @ApiProperty({
        description: 'Response message',
        nullable: false,
        default: 'Successful request',
    })
    message: string;

    @ApiProperty({
        description: 'Success status',
        nullable: false,
        default: 200,
    })
    statusCode: number;

    constructor(statusCode: number, message: string = '') {
        this.message = message;
        this.statusCode = 200;
    }
}

export class REFRESH_TOKENS_RESPONSE {
    @ApiProperty({
        description: 'Response message',
        nullable: false,
        default: 'Successful request',
    })
    message: string;

    @ApiProperty({
        description: 'Access token',
        nullable: false,
        default:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA2ZjVhN2M5LTIyMzYtNDkwNS05NjcyLThmYTA0OWIzMDdmNyIsImVtYWlsIjoidGVzdDExQGdtYWlsLmNvbSIsInJvbGVzIjpbIlVTRVIiLCJBRE1JTiJdLCJuZXdzQ2F0ZWdvcnkiOltdLCJxdWVyeSI6bnVsbCwibGFuZ3VhZ2UiOltdLCJjb3VudHJ5IjpbXSwiaWF0IjoxNzEzNzA3MTM5LCJleHAiOjE3MTQ2NTc1Mzl9.Q_6HqRXw6PfdiweoltxUw8XoQ674mkXlQ13nI0ltwG0',
    })
    accessToken: string;

    @ApiProperty({ description: 'User information' })
    user: USER_DTO;
    @ApiProperty({
        description: 'Success status',
        nullable: false,
        default: 200,
    })
    statusCode: number;

    constructor(statusCode: number, message: string = '', user: USER_DTO, accessToken = '') {
        this.message = message;
        this.accessToken = accessToken;
        this.user = user;
        this.statusCode = 200;
    }
}

export class REFRESH_TOKENS_RESPONSE_UNAUTHORIZED {
    @ApiProperty({
        description: 'Error message',
        nullable: false,
        default: 'Unauthorized',
    })
    error: string;
    @ApiProperty({
        description: 'Unauthorized',
        nullable: false,
        default: 401,
    })
    statusCode: number;

    constructor(statusCode: number, error: string = '') {
        this.error = error;
        this.statusCode = 401;
    }
}

export class GET_USER_BY_IDorEMAIL_RESPONSE {
    @ApiProperty({
        description: 'Response message',
        nullable: false,
        default: 'Successful request',
    })
    message: string;

    @ApiProperty({ description: 'User information' })
    user: USER_DTO;
    @ApiProperty({
        description: 'Success status',
        nullable: false,
        default: 200,
    })
    statusCode: number;

    constructor(statusCode: number, message: string = '', user: USER_DTO) {
        this.message = message;
        this.user = user;
        this.statusCode = 200;
    }
}

export class GET_USER_BY_IDorEMAIL_RESPONSE_UNAUTHORIZED {
    @ApiProperty({
        description: 'Error message',
        nullable: false,
        default: 'Unauthorized',
    })
    error: string;
    @ApiProperty({
        description: 'Unauthorized',
        nullable: false,
        default: 401,
    })
    statusCode: number;

    constructor(statusCode: number, error: string = '') {
        this.error = error;
        this.statusCode = 401;
    }
}
