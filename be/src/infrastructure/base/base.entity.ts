import {
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';

export abstract class AbstractBaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isArchived: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 300, default: 'Unknown' })
  createdBy: string;

  @UpdateDateColumn({
    type: 'timestamptz',
    nullable: true,
    default: null,
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  @Column({ type: 'varchar', length: 300, nullable: true })
  updatedBy: string | null;

  @BeforeInsert()
  setUpdatedAtNull() {
    this.updatedAt = null;
  }
}
