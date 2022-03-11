import { Exclude } from 'class-transformer';
import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';

@Entity({ name: 'users' })
@Unique(['name'])
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 30 })
    name: string;

    @Column({ length: 60 })
    email: string;

    @Exclude()
    @Column()
    password: string;
}
