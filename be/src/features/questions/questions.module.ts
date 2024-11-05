import { Module } from '@nestjs/common';
import { QuestionsController } from './api/questions.controller';
import { QuestionsQueryRepository } from './infrastructure/questions.query.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './domain/Question';
import { Answer } from './domain/Answer';
import { CreateQuizQuestionHandler } from './application/use-cases/create-quiz-question.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Answer])],
  controllers: [QuestionsController],
  providers: [QuestionsQueryRepository, CreateQuizQuestionHandler],
})
export class QuestionsModule {}
