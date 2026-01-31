import { IsString, IsUrl, IsOptional, IsBoolean, IsNumber } from 'class-validator'

export class CreateFriendLinkDto {
  @IsString()
  name: string

  @IsUrl()
  url: string

  @IsOptional()
  @IsString()
  logo?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsNumber()
  orderIndex?: number

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}

export class UpdateFriendLinkDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsUrl()
  url?: string

  @IsOptional()
  @IsString()
  logo?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsNumber()
  orderIndex?: number

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
