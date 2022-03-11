import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { EmailService } from 'src/email/email.service';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        private emailService: EmailService,
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
        private connection: Connection,
    ) {}

    async findAll() {
        return await this.usersRepository.find({});
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }

    async createUser(name: string, email: string, password: string) {
        const userExist = await this.checkUserExists(email);
        if (userExist) {
            throw new UnprocessableEntityException(
                '해당 이메일 또는 네임으로는 가입할 수 없습니다.',
            );
        }

        await this.saveUserUsingQueryRunner(name, email, password);
    }

    private async checkUserExists(email: string): Promise<boolean> {
        const user = await this.usersRepository.findOne({ email });

        return user !== undefined;
    }

    private async sendMemberJoinEmail(
        email: string,
        signupVerifyToken: string,
    ) {
        await this.emailService.sendMemberJoinVerification(
            email,
            signupVerifyToken,
        );
    }

    private async saveUserUsingQueryRunner(
        name: string,
        email: string,
        password: string,
    ) {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
            const user = new UserEntity();
            user.name = name;
            user.email = email;
            user.password = hashedPassword;

            await queryRunner.manager.save(user);

            await queryRunner.commitTransaction();
        } catch (e) {
            console.log(e);
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }
}
