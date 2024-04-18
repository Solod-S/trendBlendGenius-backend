// get device ID

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserАgent = createParamDecorator((_: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // switch to http and pick up the get request

    return request.headers['user-agent'];
    // get the device agent and return
});
