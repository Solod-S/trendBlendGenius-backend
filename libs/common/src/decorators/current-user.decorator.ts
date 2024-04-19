// Decorator that extracts user data from the headerimport { JwtPayload } from '@auth/interfaces';
import { ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '@auth/interfaces';
import { createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    (key: keyof JwtPayload, ctx: ExecutionContext): JwtPayload | Partial<JwtPayload> => {
        const request = ctx.switchToHttp().getRequest();
        console.log(`request`, request.user);
        // get context from request
        return key ? request.user[key] : request.user;
    },
);
