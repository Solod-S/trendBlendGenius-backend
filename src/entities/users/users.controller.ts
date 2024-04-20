import { JwtPayload } from '@auth/interfaces';
import { CurrentUser } from '@common/decorators';
import { Controller, Delete, Param, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Delete('delete/:id')
    async deleteUser(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
        // @CurrentUser('id') userId: string - then just take the ID
        // ParseUUIDPipe - if the string is not uuid it will give an error

        return this.userService.delete(id, user);
    }
}
