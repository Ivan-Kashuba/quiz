import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GameQuestion } from './GameQuestion';
import { AbstractBaseEntity } from '../../../infrastructure/base/base.entity';
import { PlayerProgress } from './PlayerGameProgress';

@Entity({ name: 'GameAnswer' })
export class GameAnswer extends AbstractBaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  body: string;

  @Column()
  isCorrect: boolean;

  @ManyToOne(() => GameQuestion, (gameQuestion) => gameQuestion.gameAnswers)
  gameQuestion: GameQuestion;

  @ManyToOne(
    () => PlayerProgress,
    (playerProgress) => playerProgress.gameAnswers,
  )
  playerProgress: PlayerProgress;

  @Column({ type: 'uuid' })
  playerProgressId: string;
}
