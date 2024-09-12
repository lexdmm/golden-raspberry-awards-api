import { Controller, Get } from '@nestjs/common';
import { AwardsService } from './awards.service';

@Controller('awards')
export class AwardsController {
  constructor(private readonly awardsService: AwardsService) {}

  @Get('producers-intervals')
  async getProducersIntervals() {
    return this.awardsService.getProducerIntervals();
  }
}
