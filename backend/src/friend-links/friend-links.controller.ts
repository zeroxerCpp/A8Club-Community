import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { FriendLinksService } from './friend-links.service'
import { CreateFriendLinkDto, UpdateFriendLinkDto } from './dto/friend-link.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('friend-links')
export class FriendLinksController {
  constructor(private readonly friendLinksService: FriendLinksService) {}

  @Get()
  findAll() {
    return this.friendLinksService.findAll()
  }

  @Get('active')
  findActive() {
    return this.friendLinksService.findActive()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.friendLinksService.findOne(+id)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createDto: CreateFriendLinkDto) {
    return this.friendLinksService.create(createDto)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateDto: UpdateFriendLinkDto) {
    return this.friendLinksService.update(+id, updateDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.friendLinksService.remove(+id)
  }
}
