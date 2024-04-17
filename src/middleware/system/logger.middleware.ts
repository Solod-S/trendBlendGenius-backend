import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor() {}

    use(req: Request, res: Response, next: NextFunction) {
        const { ip, method, originalUrl } = req;
        const userAgent = req.get('user-agent') || '';

        res.on('finish', () => {
            const { statusCode } = res;
            const contentLength = res.get('content-length');
            const green = '\x1b[32m'; // Green color
            const reset = '\x1b[0m'; // Reset color
            console.log(`${method} ${originalUrl} ${green}${statusCode}${reset} ${contentLength} - ${userAgent} ${ip}`);
        });

        next();
    }
}
