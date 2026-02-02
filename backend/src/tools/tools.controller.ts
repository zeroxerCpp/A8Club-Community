import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ToolsService } from './tools.service';
import { CreateToolDto, UpdateToolDto } from './dto/tool.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tools')
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Get()
  findAll() {
    return this.toolsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toolsService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createToolDto: CreateToolDto) {
    return this.toolsService.create(createToolDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateToolDto: UpdateToolDto) {
    return this.toolsService.update(+id, updateToolDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.toolsService.remove(+id);
  }
}
