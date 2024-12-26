import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GameQuestion } from './GameQuestion';
import { AbstractBaseEntity } from '../../../infrastructure/base/base.entity';

@Entity({ name: 'GameAnswer' })
export class GameAnswer extends AbstractBaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  body: string;

  @Column()
  isCorrect: boolean;

  @OneToOne(() => GameQuestion, (gameQuestion) => gameQuestion.gameAnswer)
  @JoinColumn({ name: 'gameQuestionId' })
  gameQuestion: GameQuestion;
}
