import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entity/movie.entity';
import { AwardsService } from './awards.service';

@Module({
  imports: [TypeOrmModule.forFeature([Movie])],
  providers: [AwardsService],
})
export class AwardsModule {
  constructor(private filmService: AwardsService) {
    this.filmService.seedData();
  }
}
