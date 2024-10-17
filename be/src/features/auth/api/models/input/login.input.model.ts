import { IsNotEmpty } from 'class-validator';
import { Trim } from '../../../../../infrastructure/decorators/transform/trim';
import { ApiProperty } from '@nestjs/swagger';

export class LoginInputModel {
  @Trim()
  @IsNotEmpty()
  @ApiProperty()
  username: string;
  @Trim()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
