import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import type { Request } from 'express';
import type { User } from 'src/db/schema';

interface Payload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context
      .switchToHttp()
      .getRequest<Request & { user: User }>();
    const token =
      this.extractTokenFromHeader(request) ??
      this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException('no access token provided');
    }

    let payload: Payload;

    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('invalid or expired access token');
    }

    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('user no longer exists');
    }

    request.user = user;
    return true;
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return undefined;
    }

    const [type, token] = authorizationHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('invalid authorization header');
    }

    return token;
  }

  private extractTokenFromCookie(req: Request): string | undefined {
    const cookies = (req as Request & { cookies?: Record<string, unknown> })
      .cookies;
    const accessToken =
      typeof cookies?.access_token === 'string'
        ? cookies.access_token
        : undefined;

    if (!accessToken) {
      return undefined;
    }

    return accessToken;
  }
}
