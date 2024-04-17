import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService) {}

    private readonly logger = new Logger(AuthService.name);

    async register(dto: RegisterDto) {
        try {
            const user: User = await this.userService.findOne(dto.email);
            if (user) {
                throw new ConflictException(`User with such email: ${dto.email} already exists`);
            }
            return this.userService.save(dto);
        } catch (err) {
            console.log(`Error in user find`, err);
            this.logger.error(err);
            return null;
        }
    }
}
