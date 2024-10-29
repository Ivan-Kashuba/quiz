import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  UserOutputModel,
  UserOutputModelMapper,
} from './models/output/user.output.model';
import { UserInputModel } from './models/input/create-user.input.model';
import { User } from './domain/User';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiConflictResponse({ description: 'Username is already in use' })
  @ApiCreatedResponse({
    type: UserOutputModel,
    description: 'Created successfully',
  })
  async createQuestion(
    @Body() userInputModel: UserInputModel,
  ): Promise<UserOutputModel> {
    const isUserExisted = await User.findOneBy({
      username: userInputModel.username,
    });

    if (isUserExisted) {
      throw new ConflictException();
    }

    const user = User.create({
      username: userInputModel.username,
      code: uuidv4(),
    });

    await user.save();

    return UserOutputModelMapper(user);
  }
}
