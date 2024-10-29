import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../domain/User';

export class UserOutputModel {
  @ApiProperty()
  id: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  code: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date | null;
}

export const UserOutputModelMapper = (user: User): UserOutputModel => {
  return {
    id: user.id,
    username: user.username,
    code: user.code,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
