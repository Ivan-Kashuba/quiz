import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import config from './infrastructure/config/env-config';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from './infrastructure/config/database.module';
import { QuestionsController } from './features/questions/api/questions.controller';
import { QuizQueryRepository } from './features/questions/infrastructure/quiz-query.repository';
import { Question } from './features/questions/domain/Question';
import { Answer } from './features/questions/domain/Answer';
import { CreateQuizQuestionHandler } from './features/questions/application/use-cases/create-quiz-question.handler';
import { TypeOrmHelper } from './infrastructure/helpers/typeorm/typeorm-helper';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    CqrsModule,
    DatabaseModule,
    TypeOrmModule.forFeature([Question, Answer]),
  ],
  controllers: [AppController, QuestionsController],
  providers: [
    AppService,
    QuizQueryRepository,
    CreateQuizQuestionHandler,
    TypeOrmHelper,
  ],
})
export class AppModule {}
