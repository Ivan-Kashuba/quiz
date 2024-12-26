import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlayerProgress } from './PlayerGameProgress';
import { GameQuestion } from './GameQuestion';
import { AbstractBaseEntity } from '../../../infrastructure/base/base.entity';

@Entity({ name: 'QuizGame' })
export class QuizGame extends AbstractBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => PlayerProgress, (playerProgress) => playerProgress.game)
  playersProgress: PlayerProgress[];

  @OneToMany(() => GameQuestion, (gameQuestion) => gameQuestion.quizGame)
  gameQuestions: GameQuestion[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  startGameDate: Date;

  @Column({ type: 'timestamptz', nullable: true })
  pairCreatedDate: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  finishGameDate: Date | null;
}
