import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CorsMiddleware, LoggerMiddleware } from '@middleware';
import { AppModule } from './app.module';
import * as packageJson from '../package.json';
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
    app.use(cookieParaser());
    app.use(new LoggerMiddleware().use);
    app.use(new CorsMiddleware().use);
    const config = new DocumentBuilder()
        .setTitle('Trend-Blend-Genius API')
        .setDescription('The API was created to create cool content for your social networks.')
        .setVersion(packageJson.version)
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT-TOKEN',
            },
            'JWT',
        )
        .build();
    const document = SwaggerModule.createDocument(app, config);
    // document.paths = {};
    SwaggerModule.setup('swagger', app, document);
    // https://localhost:1234/api/api
    await app.listen(PORT);
}

const color = {
    reset: '\x1b[32m',
    blue: '\x1b[34m',
};

bootstrap().then(() => Logger.log(`APP IS STARTED AT ${color.blue}https://localhost:${PORT}/api${color.reset}`));
