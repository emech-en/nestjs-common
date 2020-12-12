import { AuthenticationModule } from '../../authentication';

export const AuthModule = AuthenticationModule.forRoot({
  basicAuth: {
    register: true,
  },
  otp: {
    email: false,
    sms: false,
  },
});
