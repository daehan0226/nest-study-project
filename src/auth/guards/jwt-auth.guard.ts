import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        // passport - authguard jwt 에 의해 토큰 검증
        // user에서 jwt strategy의 validate에 의해 검증 후 반환되는 유저 데이터임
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}
