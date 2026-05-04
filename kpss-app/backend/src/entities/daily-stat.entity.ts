import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Subject } from './subject.entity';

@Entity('daily_stats')
@Unique(['user', 'subject', 'date'])
export class DailyStat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  user_id: number;

  @ManyToOne(() => Subject, { nullable: false })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @Column({ name: 'subject_id' })
  subject_id: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'int' })
  solved_count: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  net: number;
}
