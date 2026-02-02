import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('quotes')
export class Quote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column()
  author: string;

  @Column({ nullable: true })
  context: string; // 语录背景或出处

  @Column({ default: 0 })
  order: number; // 显示顺序

  @Column({ type: 'date', nullable: true })
  publishDate: Date; // 发布日期，多个语录可以共享同一日期

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
