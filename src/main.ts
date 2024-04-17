import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { CorsMiddleware, LoggerMiddleware } from '@middleware';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as cookieParaser from 'cookie-parser';
dotenv.config();

const PORT = process.env.PORT || 3003;
const httpsOptions = {
    key: fs.readFileSync('./secrets/key.pem'),
    cert: fs.readFileSync('./secrets/cert.pem'),
};

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { httpsOptions });
    app.setGlobalPrefix('api');
    await app.listen(PORT);
    app.use(cookieParaser());
    app.use(new LoggerMiddleware().use);
    app.use(new CorsMiddleware().use);
}

const color = {
    reset: '\x1b[32m',
    blue: '\x1b[34m',
};

bootstrap().then(() => Logger.log(`APP IS STARTED AT ${color.blue}https://localhost:${PORT}/api${color.reset}`));
