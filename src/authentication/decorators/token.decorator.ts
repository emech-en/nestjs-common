import { createParamDecorator, UnauthorizedException } from '@nestjs/common';

export const Token = createParamDecorator<never, any, string>((data, req) => {
  const token = req.token as string;
  if (!token) {
    throw new UnauthorizedException();
  }
  return token;
});
