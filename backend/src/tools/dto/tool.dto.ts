import { IsNotEmpty, IsOptional, IsNumber, IsUrl } from 'class-validator';

export class CreateToolDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsOptional()
  icon?: string;

  @IsOptional()
  category?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}

export class UpdateToolDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  icon?: string;

  @IsOptional()
  category?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}
