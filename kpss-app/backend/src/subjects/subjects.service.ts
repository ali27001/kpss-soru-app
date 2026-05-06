import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from '../entities/subject.entity';

@Injectable()
export class SubjectsService implements OnModuleInit {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async onModuleInit() {
    const count = await this.subjectRepository.count();
    if (count === 0) {
      const defaultSubjects = [
        { name: 'Türkçe' },
        { name: 'Matematik' },
        { name: 'Tarih' },
        { name: 'Coğrafya' },
        { name: 'Vatandaşlık' },
        { name: 'Eğitim Bilimleri' },
        { name: 'Güncel Bilgiler' },
      ];
      await this.subjectRepository.save(defaultSubjects);
      console.log('Varsayılan KPSS dersleri veritabanına eklendi.');
    }
  }

  findAll(): Promise<Subject[]> {
    return this.subjectRepository.find();
  }
}
