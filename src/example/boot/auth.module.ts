import { AuthenticationModule } from '../../authentication';

export const AuthModule = AuthenticationModule.forRoot({
  basicAuth: {
    email: {
      login: true,
      register: {
        required: false,
      },
      verification: false,
    },
    username: {
      login: true,
      register: {
        required: false,
      },
    },
  },
  otp: {
    email: false,
    sms: false,
  },
});
