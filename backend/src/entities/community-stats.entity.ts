import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('community_stats')
export class CommunityStats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  memberCount: number;

  @Column()
  activeMembers: number;

  @Column({ default: 0 })
  totalProjects: number;

  @Column({ default: 0 })
  totalEvents: number;

  @Column({ default: '超级A8俱乐部' })
  name: string;

  @Column('text', { nullable: true })
  subtitle: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true, default: 'contact@example.com' })
  contactEmail: string;

  @Column('simple-json', { nullable: true })
  additionalStats: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
