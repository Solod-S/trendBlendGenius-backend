import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-KEY, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        if (req.method === 'OPTIONS') {
            res.sendStatus(200);
        } else {
            next();
        }
    }
}
