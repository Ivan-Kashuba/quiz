import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  UserOutputModel,
  UserOutputModelMapper,
} from './models/output/user.output.model';
import { UserInputModel } from './models/input/create-user.input.model';
import { User } from './domain/User';
import { v4 as uuidv4 } from 'uuid';
import { UsersQueryRepository } from './infrastructure/users.query.repository';
import { ApiPaginatedResponse } from '../../../infrastructure/pagination/decorators/api-paginated-response/ApiPaginatedResponse ';
import { QuestionOutputModel } from '../../questions/api/models/output/question.output.model';
import { PaginationInputModel } from '../../../infrastructure/pagination/models/input/pagination.input.model';
import { PaginationOutputModel } from '../../../infrastructure/pagination/models/output/pagination.output.model';
import { AdminAuthGuard } from '../../../infrastructure/guards/admin-auth.guard';
import { DataSource, In } from 'typeorm';
import { getAndValidateIds } from '../../../infrastructure/helpers/delete-entities/delete-entities';
import { ApiDefaultUnauthorizedResponse } from '../../../infrastructure/decorators/swagger/default-responses';
import { CheckUserInputModel } from './models/input/check-user.input.model';
import { UsersRepository } from './infrastructure/users.repository';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private usersRepository: UsersRepository,
    private dataSource: DataSource,
  ) {}

  @Get()
  @ApiBadRequestResponse({
    description: 'Invalid query params',
  })
  @ApiQuery({
    name: 'usernameSearchTerm',
    type: String,
    required: false,
    description: 'Search by username',
  })
  @ApiPaginatedResponse(QuestionOutputModel)
  async getUsers(
    @Query()
    queryParams: {
      usernameSearchTerm?: string;
    },
    @Query() paginationInputModel: PaginationInputModel,
  ): Promise<PaginationOutputModel<UserOutputModel>> {
    const usernameSearchTerm = queryParams?.usernameSearchTerm || null;

    return await this.usersQueryRepository.findUsers(
      usernameSearchTerm,
      paginationInputModel,
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiConflictResponse({ description: 'Username is already in use' })
  @ApiCreatedResponse({
    type: UserOutputModel,
    description: 'Created successfully',
  })
  async createUser(
    @Body() userInputModel: UserInputModel,
  ): Promise<UserOutputModel> {
    const isUserExisted = await User.findOneBy({
      username: userInputModel.username,
    });

    if (isUserExisted) {
      throw new ConflictException();
    }

    const user = await this.usersRepository.createUser(userInputModel.username);

    return UserOutputModelMapper(user);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AdminAuthGuard)
  @ApiSecurity('basic')
  @ApiDefaultUnauthorizedResponse()
  @ApiNotFoundResponse({ description: 'At least one id was not found' })
  @ApiBadRequestResponse({
    description: 'At least one entity has wrong format id',
  })
  async deleteUsers(@Query('ids') questionIds: string) {
    const idsArray = getAndValidateIds(questionIds);

    const users = await User.find({
      where: { id: In(idsArray), isActive: true },
    });

    if (users.length !== idsArray.length) {
      throw new BadRequestException('Some questions were not found.');
    }

    await this.dataSource.transaction(async (entityManager) => {
      const deletedUsers = users.map((users) => ({
        ...users,
        isActive: false,
      }));

      await entityManager.save(User, deletedUsers);
    });
  }

  @Post('check')
  @ApiUnauthorizedResponse({
    description: 'There is no user with current code and username',
  })
  @ApiOkResponse({ type: UserOutputModel })
  async checkUser(
    @Body() checkUserInputModel: CheckUserInputModel,
  ): Promise<UserOutputModel> {
    const { username, code } = checkUserInputModel;

    const user = await User.findOneBy({
      username,
      code,
      isActive: true,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return UserOutputModelMapper(user);
  }
}
