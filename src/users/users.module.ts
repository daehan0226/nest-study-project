import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { EmailModule } from 'src/email/email.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [EmailModule, TypeOrmModule.forFeature([UserEntity])],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
