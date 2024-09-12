import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entity/movie.entity';
import { AwardsService } from './awards.service';
import { AwardsController } from './awards.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Movie])],
  providers: [AwardsService],
  controllers: [AwardsController],
})
export class AwardsModule {
  constructor(private filmService: AwardsService) {
    this.filmService.seedData();
  }
}
