import { ApiProperty } from '@nestjs/swagger';

export class PlayerOutputModel {
  @ApiProperty()
  id: string;
  @ApiProperty()
  username: string;
}
