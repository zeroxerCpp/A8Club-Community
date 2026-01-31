import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FoundersService } from './founders.service';
import { CreateFounderDto, UpdateFounderDto } from './dto/founder.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('founders')
export class FoundersController {
  constructor(private readonly foundersService: FoundersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createFounderDto: CreateFounderDto) {
    return this.foundersService.create(createFounderDto);
  }

  @Get()
  findAll() {
    return this.foundersService.findAll();
  }

  @Get('active')
  findActive() {
    return this.foundersService.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foundersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateFounderDto: UpdateFounderDto) {
    return this.foundersService.update(+id, updateFounderDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.foundersService.remove(+id);
  }
}
