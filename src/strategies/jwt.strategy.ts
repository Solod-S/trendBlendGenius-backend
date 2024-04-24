// https://docs.nestjs.com/recipes/passport
// jwt.strategy.ts

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '@auth/interfaces';
import { UsersService } from 'src/entities/users/users.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(JwtStrategy.name);
    constructor(
        private readonly configService: ConfigService,
        // to access env
        private readonly userService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
            // get secret from env
        });
    }

    async validate(payload: JwtPayload) {
        // console.log(`payload in JWT`, payload);
        // accepts what we put into the token !!!!!!!!!!!!!! (PROBLEM)
        // console.log(`payload`, typeof payload);
        const user = await this.userService.findOne(payload.id).catch((err) => {
            this.logger.error(err);
            return null;
        });
        console.log(`user in JWT`, user);
        if (!user) {
            throw new UnauthorizedException();
        }
        return payload;
    }
}
