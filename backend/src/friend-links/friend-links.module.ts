import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FriendLinksController } from './friend-links.controller'
import { FriendLinksService } from './friend-links.service'
import { FriendLink } from '../entities/friend-link.entity'

@Module({
  imports: [TypeOrmModule.forFeature([FriendLink])],
  controllers: [FriendLinksController],
  providers: [FriendLinksService],
  exports: [FriendLinksService],
})
export class FriendLinksModule {}
