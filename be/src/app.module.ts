import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './infrastructure/config/env-config';
import { DatabaseModule } from './infrastructure/config/database.module';
import { AuthModule } from './features/auth/auth.module';
import { QuestionsModule } from './features/questions/questions.module';
import { SharedModule } from './infrastructure/modules/shared.module';
import { UsersModule } from './features/users/users.module';
import { QuizGameModule } from './features/quiz-game/quiz-game.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    SharedModule,
    DatabaseModule,
    AuthModule,
    QuestionsModule,
    UsersModule,
    QuizGameModule,
  ],
})
export class AppModule {}
