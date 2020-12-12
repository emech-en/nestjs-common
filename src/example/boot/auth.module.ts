import { AuthenticationModule } from '../../authentication';

export const AuthModule = AuthenticationModule.forRoot({
  password: {
    register: true,
  },
  otp: {
    email: false,
    sms: false,
  },
});
