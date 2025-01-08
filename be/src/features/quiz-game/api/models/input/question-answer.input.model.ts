import { ApiProperty } from '@nestjs/swagger';
import { Trim } from '../../../../../infrastructure/decorators/transform/trim';
import { Length } from 'class-validator';

export class QuestionGameAnswerInputModel {
  @ApiProperty({ type: String, required: true })
  @Trim()
  @Length(1, 500)
  answer: string;
}
