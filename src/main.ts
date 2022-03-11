import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { ClassSerializerInterceptor } from '@nestjs/common';

dotenv.config({
    path: path.resolve(
        process.env.NODE_ENV === 'production'
            ? '.production.env'
            : process.env.NODE_ENV === 'stage'
            ? '.stage.env'
            : '.development.env',
    ),
});
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
    );

    await app.listen(3000);
}
bootstrap();
