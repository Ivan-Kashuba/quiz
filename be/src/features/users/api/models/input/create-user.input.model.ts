import { IsNotEmpty } from 'class-validator';
import { Trim } from '../../../../../infrastructure/decorators/transform/trim';
import { ApiProperty } from '@nestjs/swagger';

export class UserInputModel {
  @Trim()
  @IsNotEmpty()
  @ApiProperty()
  username: string;
}
