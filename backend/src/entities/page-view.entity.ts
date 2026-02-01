import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('page_views')
export class PageView {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ nullable: true })
  ip: string;

  @Column({ nullable: true })
  referrer: string;

  @CreateDateColumn()
  createdAt: Date;
}
