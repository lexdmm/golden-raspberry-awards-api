import { Controller, Get } from '@nestjs/common';
import { AwardsService } from './awards.service';

@Controller('awards')
export class AwardsController {
  constructor(private readonly awardsService: AwardsService) {}

  // @Get('all')
  // async getAllData() {
  //   return this.awardsService.getAll();
  // }

  @Get('producers')
  async getProducers() {
    return this.awardsService.getProducerIntervals();
  }

  @Get('winners')
  async getWinners() {
    return await this.awardsService.getWinners();
  }
}
