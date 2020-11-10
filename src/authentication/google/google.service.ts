import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginResponse } from '../dto';
import { UserBaseEntity } from '../models';
import { AuthenticationService } from '../authentication.service';
import { RegisterType } from '../register';
import { RequestTransaction } from '../../request-transaction';
import { OAuth2Client } from 'google-auth-library';
import { GoogleLoginDto } from './dto';
import { GOOGLE_WEB_CLIENT_ID } from './google.helpers';

@Injectable()
export class GoogleService {
  constructor(
    @Inject(GOOGLE_WEB_CLIENT_ID)
    private readonly webClientId: string,
    private readonly authenticationService: AuthenticationService,
    private readonly requestTransaction: RequestTransaction,
  ) {}

  async loginByGoogle(loginDto: GoogleLoginDto): Promise<LoginResponse> {
    const client = new OAuth2Client(this.webClientId);

    if (!loginDto || !loginDto.idToken || !loginDto.user || !loginDto.user.email || !loginDto.user.id) {
      throw new UnauthorizedException();
    }

    const ticket = await client.verifyIdToken({
      idToken: loginDto.idToken,
      audience: this.webClientId,
    });

    const payload = ticket.getPayload();
    if (payload?.email !== loginDto.user.email) {
      throw new UnauthorizedException();
    }

    const userRepo = this.requestTransaction.getRepository(UserBaseEntity);
    let user = await userRepo.findOne({ googleId: loginDto.user.id });
    if (!user) {
      user = await userRepo.findOne({ email: loginDto.user.email });
      if (user) {
        user.googleId = loginDto.user.id;
        await userRepo.save(user);
      }
    }

    if (!user) {
      const userData: Partial<UserBaseEntity> = { email: loginDto.user.email, googleId: loginDto.user.id };
      user = await this.authenticationService.register(userData, RegisterType.GOOGLE, loginDto);
    }

    return this.authenticationService.login(user);
  }
}
