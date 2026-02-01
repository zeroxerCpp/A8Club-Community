import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseController } from './database.controller';
import { DatabaseService } from './database.service';
import { Founder } from '../entities/founder.entity';
import { Project } from '../entities/project.entity';
import { News } from '../entities/news.entity';
import { CommunityStats } from '../entities/community-stats.entity';
import { FriendLink } from '../entities/friend-link.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Founder,
      Project,
      News,
      CommunityStats,
      FriendLink,
      User,
    ]),
  ],
  controllers: [DatabaseController],
  providers: [DatabaseService],
})
export class DatabaseModule {}
