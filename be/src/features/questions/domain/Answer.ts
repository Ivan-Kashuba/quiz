import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './Question';
import { AbstractBaseEntity } from '../../../infrastructure/base/base.entity';

@Entity({ name: 'Answer' })
export class Answer extends AbstractBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => Question, (question) => question.answers)
  question: Question;
}
