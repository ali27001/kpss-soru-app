import { Controller, Post, Get, Body, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DailyStatsService } from './daily-stats.service';
import { CreateDailyStatDto } from './dto/create-daily-stat.dto';

@Controller('daily-stats')
@UseGuards(JwtAuthGuard) // Tüm endpoint'ler JWT gerektirir
export class DailyStatsController {
  constructor(private readonly dailyStatsService: DailyStatsService) {}

  // POST /daily-stats — günlük istatistik ekle veya güncelle
  // user_id JWT token'dan alınır, body'den alınmaz (güvenlik)
  @Post()
  create(@Request() req: any, @Body() dto: CreateDailyStatDto) {
    return this.dailyStatsService.upsert(req.user.userId, dto);
  }

  // GET /daily-stats?date=YYYY-MM-DD — belirli güne ait kayıtlar
  @Get()
  findByDate(@Request() req: any, @Query('date') date: string) {
    return this.dailyStatsService.findByDate(req.user.userId, date);
  }
}
