import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import config from './infrastructure/config/env-config';
import { DatabaseModule } from './infrastructure/config/database.module';
import { Question } from './features/questions/domain/Question';
import { Answer } from './features/questions/domain/Answer';
import { User } from './features/users/api/domain/User';
import { AuthModule } from './features/auth/auth.module';
import { QuestionsModule } from './features/questions/questions.module';
import { SharedModule } from './infrastructure/modules/shared.module';
import { UsersModule } from './features/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    SharedModule,
    DatabaseModule,
    TypeOrmModule.forFeature([Question, Answer, User]),
    AuthModule,
    QuestionsModule,
    UsersModule,
  ],
})
export class AppModule {}
