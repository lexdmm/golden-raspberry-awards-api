import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entity/movie.entity';
import { AwardsService } from './awards.service';
import { AwardsController } from './awards.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Movie])],
  providers: [AwardsService],
  controllers: [AwardsController],
})
export class AwardsModule implements OnModuleInit {
  constructor(private readonly awardsService: AwardsService) {}

  async onModuleInit() {
    await this.awardsService.seedData();
  }
}
