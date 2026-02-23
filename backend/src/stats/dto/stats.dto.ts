import { IsNotEmpty, IsNumber, IsOptional, IsObject, IsString } from 'class-validator';

export class CreateStatsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsNotEmpty()
  @IsNumber()
  memberCount: number;

  @IsNotEmpty()
  @IsNumber()
  activeMembers: number;

  @IsOptional()
  @IsNumber()
  totalProjects?: number;

  @IsOptional()
  @IsNumber()
  totalEvents?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  contactEmail?: string;

  @IsOptional()
  @IsObject()
  additionalStats?: Record<string, any>;
}

export class UpdateStatsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsNumber()
  memberCount?: number;

  @IsOptional()
  @IsNumber()
  activeMembers?: number;

  @IsOptional()
  @IsNumber()
  totalProjects?: number;

  @IsOptional()
  @IsNumber()
  totalEvents?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  contactEmail?: string;

  @IsOptional()
  @IsObject()
  additionalStats?: Record<string, any>;
}
