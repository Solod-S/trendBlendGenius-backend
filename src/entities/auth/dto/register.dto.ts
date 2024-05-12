import { IsPasswordsMatchingConstraint } from '@common/decorators';
import { IsArray, IsEmail, IsOptional, IsString, MinLength, Validate } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @MinLength(6)
    @Validate(IsPasswordsMatchingConstraint)
    passwordRepet: string;
}

export class updateUserDto {
    @IsString()
    @MinLength(6)
    password: string;

    @IsArray()
    @IsOptional()
    newsCategory: string[];

    @IsOptional()
    query: string;

    @IsOptional()
    tone: string;

    @IsArray()
    @IsOptional()
    language: string[];

    @IsOptional()
    useEmojis: boolean;

    @IsOptional()
    useLink: boolean;

    @IsOptional()
    endWithQuestion: boolean;

    @IsArray()
    @IsOptional()
    country: string[];

    @IsString()
    @IsOptional()
    newsApiKey: string;

    @IsString()
    @IsOptional()
    openAIkey: string;
}
