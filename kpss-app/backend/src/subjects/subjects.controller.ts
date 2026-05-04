import { Controller, Get } from '@nestjs/common';
import { SubjectsService } from './subjects.service';

// GET /subjects — JWT gerektirmez, herkese açık
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  findAll() {
    return this.subjectsService.findAll();
  }
}
