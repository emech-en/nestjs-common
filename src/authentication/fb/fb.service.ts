import { HttpService, Injectable } from '@nestjs/common';
import { LoginResponse } from '../dto';
import { UserBaseEntity } from '../models';
import { AuthenticationService } from '../authentication.service';
import { RegisterType } from '../register';
import { RequestTransaction } from '../../request-transaction';
import { FbPublicProfileDto } from './dto';

@Injectable()
export class FBService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly requestTransaction: RequestTransaction,
    private readonly httpService: HttpService,
  ) {}

  async getUserInfo(accessToken: string): Promise<FbPublicProfileDto> {
    const userInfo = await this.httpService
      .get<FbPublicProfileDto>(`https://graph.facebook.com/me`, {
        params: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          access_token: accessToken,
          fields: 'id,email,first_name,last_name,middle_name,name,name_format,picture,short_name',
        },
      })
      .toPromise();
    return userInfo.data;
  }

  async loginByFacebook(accessToken: string): Promise<LoginResponse> {
    const userDto = await this.getUserInfo(accessToken);
    const { email, id } = userDto;

    const userRepo = this.requestTransaction.getRepository(UserBaseEntity);
    let user = await userRepo.findOne({ facebookId: id });
    if (!user && email) {
      user = await userRepo.findOne({ email });
      if (user) {
        user.facebookId = id;
        await userRepo.save(user);
      }
    }

    if (!user) {
      const userData: Partial<UserBaseEntity> = { email, facebookId: id };
      user = await this.authenticationService.register(userData, RegisterType.FACEBOOK, {
        ...userDto,
        fbToken: accessToken,
      });
    }

    return this.authenticationService.login(user);
  }
}
