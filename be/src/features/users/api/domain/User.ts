import { Column, Entity } from 'typeorm';
import { AbstractBaseEntity } from '../../../../infrastructure/base/base.entity';

@Entity({ name: 'User' })
export class User extends AbstractBaseEntity {
  @Column()
  username: string;

  @Column()
  code: string;
}
