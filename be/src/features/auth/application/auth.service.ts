import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from '../../../infrastructure/config/env-config';
import { UsersRepository } from '../../users/api/infrastructure/users.repository';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private configService: ConfigService,
    private usersRepository: UsersRepository,
  ) {
    this.googleClient = new OAuth2Client(
      this.configService.get<string>(EnvVariables.GOOGLE_CLIENT_ID),
    );
  }

  async authenticateGoogleUser(token: string): Promise<any> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: this.configService.get<string>(EnvVariables.GOOGLE_CLIENT_ID),
      });
      const payload = ticket.getPayload();

      if (!payload?.email_verified) {
        throw new UnauthorizedException('Google email not verified');
      }

      const user = await this.usersRepository.findUserByUsername(payload.email);

      if (!user) {
        return await this.usersRepository.createUser(payload.email);
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid Google token');
    }
  }
}
