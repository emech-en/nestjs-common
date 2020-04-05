import { HttpService, Injectable } from '@nestjs/common';
import { LoginResponse } from '../dto';
import { UserBaseEntity } from '../models';
import { AuthenticationService } from '../authentication.service';
import { RegisterType } from '../register';
import { RequestTransaction } from '../../request-transaction';

@Injectable()
export class FBService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly requestTransaction: RequestTransaction,
    private readonly httpService: HttpService,
  ) {}

  async loginByFacebook(accessToken: string): Promise<LoginResponse> {
    const userInfo = await this.httpService
      .get(`https://graph.facebook.com/me`, {
        params: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          access_token: accessToken,
          fields: 'first_name, last_name, name,email',
        },
      })
      .toPromise();
    const userDto = userInfo.data;

    const userRepo = this.requestTransaction.getRepository(UserBaseEntity);
    let user = await userRepo.findOne({ email: userDto.email });
    if (!user) {
      const userData = { email: userDto.active_email };
      user = await this.authenticationService.register(userData, RegisterType.FACEBOOK, {
        ...userDto,
        fbToken: accessToken,
      });
    }
    return this.authenticationService.login(user);
  }
}
