import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateQuestionPublishStatusModel {
  @IsBoolean()
  @ApiProperty()
  published: boolean;
}
