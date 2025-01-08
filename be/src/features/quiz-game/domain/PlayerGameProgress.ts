import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractBaseEntity } from '../../../infrastructure/base/base.entity';
import { User } from '../../users/api/domain/User';
import { QuizGame } from './QuizGame';
import { GameAnswer } from './GameAnswer';

@Entity({ name: 'PlayerProgress' })
export class PlayerProgress extends AbstractBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false })
  playerAccount: User;

  @ManyToOne(() => QuizGame, (quizGame) => quizGame.playersProgress)
  game: QuizGame;

  @Column({ type: 'uuid' })
  gameId: string;

  @OneToMany(() => GameAnswer, (gameAnswer) => gameAnswer.playerProgress)
  gameAnswers: GameAnswer[];
}
