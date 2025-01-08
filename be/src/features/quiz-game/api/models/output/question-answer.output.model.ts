import { AnswerStatus } from '../../../domain/enums/AnswerStatus';
import { ApiProperty } from '@nestjs/swagger';

export class QuestionAnswerOutputModel {
  @ApiProperty({ type: String })
  questionId: string;
  @ApiProperty({ enum: AnswerStatus })
  answerStatus: AnswerStatus;
  @ApiProperty({ type: String })
  addedAt: string;
}
