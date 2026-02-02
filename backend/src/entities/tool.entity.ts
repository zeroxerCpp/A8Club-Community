import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('tools')
export class Tool {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  icon: string; // 图标 URL

  @Column({ nullable: true })
  category: string; // 工具分类

  @Column({ nullable: true })
  author: string; // 作者

  @Column({ default: 0 })
  order: number; // 显示顺序

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
