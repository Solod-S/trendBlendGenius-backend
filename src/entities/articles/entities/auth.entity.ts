import { ApiProperty } from '@nestjs/swagger';

export class ARTICLE_DTO {
    @ApiProperty({ description: 'Article ID' })
    id: string;

    @ApiProperty({ description: 'Article title' })
    title: string;

    @ApiProperty({ description: 'Article description' })
    description: string;

    @ApiProperty({ description: 'Article html' })
    html: string;

    @ApiProperty({ description: 'Article author' })
    author: string;

    @ApiProperty({ description: 'Article image url' })
    urlToImage: string;

    @ApiProperty({ description: 'Article url' })
    url: string;

    @ApiProperty({ description: 'Article source' })
    source: {
        id: string | null;
        name: string;
    };

    @ApiProperty({ description: 'Article published date' })
    publishedAt: Date;

    @ApiProperty({ description: 'Article crate date' })
    createdAt: Date;

    @ApiProperty({ description: 'Article last update date' })
    updatedAt: Date;

    @ApiProperty({ description: 'Article userId' })
    userId: string;

    constructor(
        id: string,
        title: string,
        description: string,
        author: string,
        urlToImage: string,
        url: string,
        source: {
            id: string | null;
            name: string;
        },
        publishedAt: Date,
        createdAt: Date,
        updatedAt: Date,
        userId: string,
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.author = author;
        this.urlToImage = urlToImage;
        this.url = url;
        this.source = source;
        this.publishedAt = publishedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.userId = userId;
    }
}

export class CREATE_ARTICLE_RESPONSE {
    @ApiProperty({
        description: 'Response message',
        nullable: false,
        default: 'Successful request',
    })
    message: string;

    @ApiProperty({ description: 'Article information' })
    data: ARTICLE_DTO;
    @ApiProperty({
        description: 'Success status',
        nullable: false,
        default: 201,
    })
    statusCode: number;

    constructor(statusCode: number, message: string = '', user: ARTICLE_DTO) {
        this.message = message;
        this.data = user;
        this.statusCode = 201;
    }
}

export class CREATE_ARTICLE_UNAUTHORIZED_RESPONSE {
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

export class CREATE_ARTICLE_BAD_RESPONSE {
    @ApiProperty({
        description: 'Response message',
        nullable: false,
        default: 'Bad request - missing query',
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
