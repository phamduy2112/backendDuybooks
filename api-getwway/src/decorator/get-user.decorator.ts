import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

export const GetUser = createParamDecorator(
  async (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }

    const token = authHeader.split(' ')[1]; // Tách token ra
    const authService: ClientProxy = request.authService;

    if (!authService) {
      throw new Error('AuthService not found in request');
    }

    try {
      const decoded = await firstValueFrom(authService.send('verify-token', { token }));
      return decoded.id;
    } catch (error) {
      throw new Error('Token verification failed');
    }
  },
)