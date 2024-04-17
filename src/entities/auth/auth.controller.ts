import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Post,
    UseInterceptors,
} from '@nestjs/common';
import { RegisterDto } from './dto';
import { AuthService } from './auth.service';
import { UserResponse } from '../users/responses';

@UseInterceptors(ClassSerializerInterceptor)
// for UserResponse transformer
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('register')
    async register(@Body() dto: RegisterDto) {
        const user = await this.authService.register(dto);

        if (!user) {
            throw new BadRequestException(`Error registering ${JSON.stringify(dto)}`);
        }
        return new UserResponse(user);
    }
}
