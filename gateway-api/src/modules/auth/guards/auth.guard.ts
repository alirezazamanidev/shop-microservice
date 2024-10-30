import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { isJWT } from 'class-validator';
import { catchError, lastValueFrom, Observable } from 'rxjs';
import { AuthMessages } from 'src/common/enums/messages.enum';
import { Services } from 'src/common/enums/service.enum';
import { AuthPatterns } from '../enums/auth-patterns';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(Services.User) private authClientService: ClientProxy) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    const token = this.extractToken(request);
    request.user = await lastValueFrom(
      this.authClientService.send(AuthPatterns.CheckLogin, { token }).pipe(
        catchError((err) => {
          throw new HttpException(err.message, err.statusCode);
        }),
      ),
    );

    return true;
  }
  protected extractToken(request: Request) {
    let accessToken = null;

    accessToken = request.headers?.['authorization'];

    if (!accessToken || accessToken.trim() == '')
      throw new UnauthorizedException(AuthMessages.LoginIsRequired);
    const [bearer, token] = accessToken.split(' ');
    if (bearer.toLowerCase() !== 'bearer' || !token || !isJWT(token))
      throw new UnauthorizedException(AuthMessages.LoginIsRequired);

    return token;
  }
}
