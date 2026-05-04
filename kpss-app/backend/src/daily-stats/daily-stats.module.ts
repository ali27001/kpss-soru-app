import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyStat } from '../entities/daily-stat.entity';
import { DailyStatsService } from './daily-stats.service';
import { DailyStatsController } from './daily-stats.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DailyStat])],
  controllers: [DailyStatsController],
  providers: [DailyStatsService],
  exports: [DailyStatsService],
})
export class DailyStatsModule {}
