import { Column, Entity, OneToMany } from 'typeorm';
import { Answer } from './Answer';
import { AbstractBaseEntity } from '../../../infrastructure/base/base.entity';

@Entity({ name: 'Question' })
export class Question extends AbstractBaseEntity {
  questionId: string;

  @Column()
  body: string;

  @Column({ default: false })
  published: boolean;

  @OneToMany(() => Answer, (answer) => answer.question, { cascade: true })
  answers: Answer[];
}
