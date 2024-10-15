import { Question } from '../../../domain/Question';

export class QuestionOutputModel {
  id: string;
  body: string;
  correctAnswers: string[];
  published: boolean;
  createdAt: Date;
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
