import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginOutputModel } from './models/output/login.output.model';
import { LoginInputModel } from './models/input/login.input.model';
import {
  envConfig,
  EnvVariables,
} from '../../../infrastructure/config/env-config';
import { AuthService } from '../application/auth.service';
import { UserOutputModelMapper } from '../../users/api/models/output/user.output.model';

@ApiTags('Auth')
@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sa/auth/login')
  @ApiOkResponse({
    type: LoginOutputModel,
    description: 'Logged in successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Bad credentials' })
  async login(
    @Body() loginInputModel: LoginInputModel,
  ): Promise<LoginOutputModel> {
    const { password, username } = loginInputModel;

    const token = Buffer.from(`${username}:${password}`).toString('base64');

    if (`Basic ${token}` !== envConfig[EnvVariables.ADMIN_AUTH_HEADER]) {
      throw new UnauthorizedException();
    }

    return { accessToken: token };
  }

  @Post('auth/google')
  async googleAuth(@Body('token') token: string) {
    if (!token) throw new BadRequestException('Token is required');

    const user = await this.authService.authenticateGoogleUser(token);

    return UserOutputModelMapper(user);
  }
}
