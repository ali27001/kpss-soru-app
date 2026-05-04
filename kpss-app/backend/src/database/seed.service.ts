import { Injectable } from '@nestjs/common';
import { OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from '../entities/subject.entity';

const SEED_SUBJECTS = ['Türkçe', 'Tarih', 'Coğrafya', 'Matematik', 'Vatandaşlık'];

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const count = await this.subjectRepository.count();
    if (count === 0) {
      const subjects = SEED_SUBJECTS.map((name) =>
        this.subjectRepository.create({ name }),
      );
      await this.subjectRepository.save(subjects);
      console.log('Seed: Subjects eklendi:', SEED_SUBJECTS.join(', '));
    }
  }
}
