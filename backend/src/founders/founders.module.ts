import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoundersService } from './founders.service';
import { FoundersController } from './founders.controller';
import { Founder } from '../entities/founder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Founder])],
  controllers: [FoundersController],
  providers: [FoundersService],
})
export class FoundersModule {}
