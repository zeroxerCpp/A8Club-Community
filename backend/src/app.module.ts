import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FoundersModule } from './founders/founders.module';
import { ProjectsModule } from './projects/projects.module';
import { StatsModule } from './stats/stats.module';
import { NewsModule } from './news/news.module';
import { FriendLinksModule } from './friend-links/friend-links.module';
import { User } from './entities/user.entity';
import { Founder } from './entities/founder.entity';
import { Project } from './entities/project.entity';
import { CommunityStats } from './entities/community-stats.entity';
import { News } from './entities/news.entity';
import { FriendLink } from './entities/friend-link.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Founder, Project, CommunityStats, News, FriendLink],
        synchronize: true,
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    FoundersModule,
    ProjectsModule,
    StatsModule,
    NewsModule,
    FriendLinksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
