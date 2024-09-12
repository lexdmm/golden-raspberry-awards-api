import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import { Movie } from './entity/movie.entity';

const PATH_CSV = '../shared/movielist.csv';

@Injectable()
export class AwardsService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  async seedData() {
    try {
      const csvFilePath = path.join(__dirname, PATH_CSV);
      const movies: Movie[] = [];
      fs.createReadStream(csvFilePath)
        .pipe(csv({ separator: ';' }))
        .on('data', (data) => {
          movies.push({
            id: data.id,
            year: +data.year,
            title: data.title,
            studios: data.studios,
            producers: data.producers,
            winner: data.winner === 'yes',
          });
        })
        .on('end', async () => {
          await this.moviesRepository.save(movies);
        });
    } catch (error) {
      if (error.message) {
        throw new HttpException(error.message, error.status);
      }
      throw new HttpException(error, 500);
    }
  }

  async getAllWinners() {
    return this.moviesRepository.find({ where: { winner: true } });
  }

  async getProducerIntervals() {
    const winners = await this.getAllWinners();
    const producersMap = new Map();

    winners.forEach((winner) => {
      winner.producers.split(',').forEach((producer) => {
        producer = producer.trim();
        if (!producersMap.has(producer)) {
          producersMap.set(producer, []);
        }
        producersMap.get(producer).push(winner.year);
      });
    });

    const minIntervals = [];
    const maxIntervals = [];

    producersMap.forEach((years, producer) => {
      years.sort();
      for (let i = 1; i < years.length; i++) {
        const interval = years[i] - years[i - 1];
        const result = {
          producer,
          interval,
          previousWin: years[i - 1],
          followingWin: years[i],
        };

        if (minIntervals.length === 0 || interval < minIntervals[0].interval) {
          minIntervals.length = 0;
          minIntervals.push(result);
        } else if (interval === minIntervals[0].interval) {
          minIntervals.push(result);
        }

        if (maxIntervals.length === 0 || interval > maxIntervals[0].interval) {
          maxIntervals.length = 0;
          maxIntervals.push(result);
        } else if (interval === maxIntervals[0].interval) {
          maxIntervals.push(result);
        }
      }
    });

    return { min: minIntervals, max: maxIntervals };
  }
}
