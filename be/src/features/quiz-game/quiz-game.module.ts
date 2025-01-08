import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizPairGameController } from './api/quiz-pair-game.controller';
import { ConnectToQuizHandler } from './application/use-cases/connect-to-the-quiz-game.handler';
import { GameAnswer } from './domain/GameAnswer';
import { GameQuestion } from './domain/GameQuestion';
import { PlayerProgress } from './domain/PlayerGameProgress';
import { QuizGame } from './domain/QuizGame';
import { QuizGameQueryRepository } from './infrastructure/quiz-game.query.repository';
import { AnswerNextQuizQuestionHandler } from './application/use-cases/answer-next-quiz-question.handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GameAnswer,
      GameQuestion,
      PlayerProgress,
      QuizGame,
    ]),
  ],
  controllers: [QuizPairGameController],
  providers: [
    ConnectToQuizHandler,
    AnswerNextQuizQuestionHandler,
    QuizGameQueryRepository,
  ],
})
export class QuizGameModule {}
