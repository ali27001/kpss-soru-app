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
}
