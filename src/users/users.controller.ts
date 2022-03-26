import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ParseIntPipe,
    DefaultValuePipe,
    ClassSerializerInterceptor,
    UseInterceptors,
    UseGuards,
    HttpException,
    HttpStatus,
    UseFilters,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';
import { ValidationPipe } from 'src/validations.ts/validation.pipe';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        const { name, email, password } = createUserDto;
        await this.usersService.createUser(name, email, password);
    }
    @Post('/email-verify')
    async verifyEmail(
        @Query() verifyEmailDto: VerifyEmailDto,
    ): Promise<string> {
        return;
    }

    @Get('find')
    @UseInterceptors(LoggingInterceptor)
    @UseFilters(new HttpExceptionFilter())
    async findtest() {
        console.log('in router');
        throw new HttpException(
            {
                status: HttpStatus.FORBIDDEN,
                error: 'This is a custom message',
            },
            HttpStatus.FORBIDDEN,
        );
    }

    @Post('/login')
    async login(@Body() dto: UserLoginDto): Promise<string> {
        return;
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseInterceptors(LoggingInterceptor)
    @UseFilters(new HttpExceptionFilter())
    @Get()
    findAll(
        @Query(
            'offset',
            new DefaultValuePipe(0),
            new ValidationPipe(),
            ParseIntPipe,
        )
        offset: number,
        @Query(
            'limit',
            new DefaultValuePipe(10),
            new ValidationPipe(),
            ParseIntPipe,
        )
        limit: number,
    ) {
        console.log('in router');
        throw new HttpException('t', 400);
        return this.usersService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.usersService.update(+id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.remove(+id);
    }
}
