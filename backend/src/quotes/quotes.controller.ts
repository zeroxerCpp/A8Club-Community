import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto, UpdateQuoteDto, BatchImportQuoteDto } from './dto/quote.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : undefined;
    const pageSize = limit ? parseInt(limit, 10) : undefined;
    return this.quotesService.findAll(pageNum, pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quotesService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createQuoteDto: CreateQuoteDto) {
    return this.quotesService.create(createQuoteDto);
  }

  @Post('batch-import')
  @UseGuards(JwtAuthGuard)
  batchImport(@Body() batchImportDto: BatchImportQuoteDto) {
    return this.quotesService.batchImport(batchImportDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateQuoteDto: UpdateQuoteDto) {
    return this.quotesService.update(+id, updateQuoteDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.quotesService.remove(+id);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  removeAll() {
    return this.quotesService.removeAll();
  }

  @Get('export/json')
  @UseGuards(JwtAuthGuard)
  exportJson() {
    return this.quotesService.exportJson();
  }

  @Post('import/json')
  @UseGuards(JwtAuthGuard)
  importJson(@Body() data: { quotes: any[] }) {
    return this.quotesService.importJson(data.quotes);
  }
}
