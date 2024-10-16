import { Question } from '../../../domain/Question';
import { ApiProperty } from '@nestjs/swagger';

export class QuestionOutputModel {
  @ApiProperty()
  id: string;
  @ApiProperty()
  body: string;
  @ApiProperty()
  correctAnswers: string[];
  @ApiProperty()
  published: boolean;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date | null;
}

export const QuestionOutputModelMapper = (
  question: Question,
): QuestionOutputModel => {
  return {
    id: question.id,
    body: question.body,
    correctAnswers: question.answers.map((a) => a.content),
    published: question.published,
    createdAt: question.createdAt,
    updatedAt: question.updatedAt,
  };
};
