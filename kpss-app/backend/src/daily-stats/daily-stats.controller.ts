import { Controller, Post, Get, Delete, Body, Query, Param, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
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

  // GET /daily-stats/weekly — son 7 günlük özet
  // ÖNEMLİ: Bu route @Get() 'den önce tanımlanmalı, aksi halde "weekly" date param olarak yorumlanır
  @Get('weekly')
  getWeekly(@Request() req: any) {
    return this.dailyStatsService.getWeeklySummary(req.user.userId);
  }

  // DELETE /daily-stats/:id — kaydı sil
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Request() req: any, @Param('id') id: string) {
    return this.dailyStatsService.remove(req.user.userId, +id);
  }
}

