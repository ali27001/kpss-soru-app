import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyStat } from '../entities/daily-stat.entity';
import { CreateDailyStatDto } from './dto/create-daily-stat.dto';

@Injectable()
export class DailyStatsService {
  constructor(
    @InjectRepository(DailyStat)
    private readonly dailyStatRepository: Repository<DailyStat>,
  ) {}

  async upsert(userId: number, dto: CreateDailyStatDto): Promise<DailyStat> {
    if (dto.net > dto.solved_count) {
      throw new BadRequestException('net değeri solved_count değerinden büyük olamaz');
    }

    // Aynı kullanıcı + ders + tarih kombinasyonu varsa güncelle, yoksa ekle
    const existing = await this.dailyStatRepository.findOne({
      where: { user_id: userId, subject_id: dto.subject_id, date: dto.date },
    });

    if (existing) {
      existing.solved_count = dto.solved_count;
      existing.net = dto.net;
      return this.dailyStatRepository.save(existing);
    }

    const stat = this.dailyStatRepository.create({
      user_id: userId,
      subject_id: dto.subject_id,
      date: dto.date,
      solved_count: dto.solved_count,
      net: dto.net,
    });
    return this.dailyStatRepository.save(stat);
  }

  findByDate(userId: number, date: string): Promise<DailyStat[]> {
    return this.dailyStatRepository.find({
      where: { user_id: userId, date },
    });
  }

  // Son 7 güne ait toplam çözülen soru sayısını döner
  // Veri olmayan günler için total_solved: 0 olarak doldurulur
  async getWeeklySummary(userId: number): Promise<{ date: string; total_solved: number }[]> {
    const result: { date: string; total_solved: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD

      const stats = await this.dailyStatRepository.find({
        where: { user_id: userId, date: dateStr },
      });

      const total = stats.reduce((sum, s) => sum + Number(s.solved_count), 0);
      result.push({ date: dateStr, total_solved: total });
    }

    return result;
  }

  async remove(userId: number, id: number): Promise<void> {
    const stat = await this.dailyStatRepository.findOne({
      where: { id, user_id: userId },
    });
    if (!stat) {
      throw new BadRequestException('Kayıt bulunamadı veya silme yetkiniz yok');
    }
    await this.dailyStatRepository.remove(stat);
  }
}


