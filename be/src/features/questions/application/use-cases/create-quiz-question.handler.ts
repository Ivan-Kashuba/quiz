import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ArrayMinSize,
  IsArray,
  IsString,
  Length,
  validateOrReject,
} from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Trim } from '../../../../infrastructure/decorators/transform/trim';

import { DataSource } from 'typeorm';
import { Question } from '../../domain/Question';
import { Answer } from '../../domain/Answer';

export class CreateQuizQuestionCommand {
  @Trim()
  @Length(10, 500)
  body: string;
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  correctAnswers: string[];

  constructor(data: CreateQuizQuestionCommand) {
    Object.assign(this, plainToClass(CreateQuizQuestionCommand, data));
  }
}

@CommandHandler(CreateQuizQuestionCommand)
export class CreateQuizQuestionHandler
  implements ICommandHandler<CreateQuizQuestionCommand>
{
  constructor(private dataSource: DataSource) {}

  async execute(command: CreateQuizQuestionCommand): Promise<Question> {
    await validateOrReject(command);

    const { body, correctAnswers } = command;

    const newAnswers = correctAnswers.map((answer) => {
      return Answer.create({ content: answer });
    });

    const newQuizQuestion = Question.create({
      body,
      answers: newAnswers,
    });

    return await this.dataSource.transaction(async (entityManager) => {
      return await entityManager.save(Question, newQuizQuestion);
    });
  }
}
