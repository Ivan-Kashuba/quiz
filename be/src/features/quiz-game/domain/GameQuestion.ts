import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { GameAnswer } from './GameAnswer';
import { QuizGame } from './QuizGame';
import { AbstractBaseEntity } from '../../../infrastructure/base/base.entity';
import { Question } from '../../questions/domain/Question';

@Entity({ name: 'GameQuestion' })
export class GameQuestion extends AbstractBaseEntity {
  @Column()
  body: string;

  @OneToOne(() => GameQuestion, (gameQuestion) => gameQuestion.gameAnswer)
  gameAnswer: GameAnswer;

  @OneToOne(() => Question, (question) => question.gameQuestion)
  @JoinColumn()
  question: Question;

  @ManyToOne(() => QuizGame, (quizGame) => quizGame.gameQuestions)
  quizGame: QuizGame;
}
