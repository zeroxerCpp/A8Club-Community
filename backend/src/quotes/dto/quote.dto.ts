import { IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateQuoteDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  author: string;

  @IsOptional()
  context?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  publishDate?: string; // 日期格式: YYYY-MM-DD
}

export class UpdateQuoteDto {
  @IsOptional()
  content?: string;

  @IsOptional()
  author?: string;

  @IsOptional()
  context?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  publishDate?: string; // 日期格式: YYYY-MM-DD
}

export class BatchImportQuoteDto {
  @IsNotEmpty()
  content: string; // 用空行分隔的多段语录文本

  @IsNotEmpty()
  author: string; // 统一的作者

  @IsOptional()
  publishDate?: string; // 统一的发布日期

  @IsOptional()
  context?: string; // 统一的出处/背景
}
