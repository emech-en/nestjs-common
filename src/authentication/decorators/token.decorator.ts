import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const Token = createParamDecorator<never, ExecutionContext, string>((data, context) => {
  const req = context.switchToHttp().getRequest();

  const token = req.token as string;
  if (!token) {
    throw new UnauthorizedException();
  }
  return token;
});
