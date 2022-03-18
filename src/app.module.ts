import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';

@Module({
    imports: [
        UsersModule,
        ConfigModule.forRoot({
            envFilePath: [
                `${__dirname}/config/env/.${process.env.NODE_ENV}.env`,
            ],
            load: [emailConfig],
            isGlobal: true,
            validationSchema,
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT, 10),
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: 'nest',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE),
        }),
        AuthModule,
        EmailModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
