import { ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

jest.mock('src/users/users.service', () => ({
  UsersService: class UsersService {},
}));

import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  it('uses the access token from cookies when the Authorization header is missing', async () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(false),
    } as unknown as Reflector;

    const jwtService = {
      verifyAsync: jest.fn().mockResolvedValue({
        sub: 'user-1',
        email: 'user@example.com',
        role: 'user',
      }),
    } as unknown as JwtService;

    const configService = {
      get: jest.fn().mockReturnValue('test-secret'),
    } as unknown as ConfigService;

    const usersService = {
      findById: jest.fn().mockResolvedValue({
        id: 'user-1',
        email: 'user@example.com',
        role: 'user',
        isVerified: true,
      }),
    } as unknown as UsersService;

    const guard = new JwtAuthGuard(
      reflector,
      jwtService,
      configService,
      usersService,
    );

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
          cookies: {
            access_token: 'cookie-token',
          },
        }),
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('cookie-token', {
      secret: 'test-secret',
    });
  });
});
