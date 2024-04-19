// get the values from cookies by key
// WARNING add app.use(cookieParaser())
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Cookies = createParamDecorator((key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // switch to http and pick up the get request
    console.log(`request.cookies`, request.cookies);
    return key && key in request.cookies ? request.cookies[key] : key ? null : request.cookies;
    // if a key is passed and this key is in the cookie object, then we return the value of the key,
    // if not, we check the key - if there is, we return null if there is no cookie request
});
