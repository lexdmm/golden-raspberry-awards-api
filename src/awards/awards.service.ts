import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import { Movie } from './entity/movie.entity';
import { CreateAwardDto } from './dto/create-award.dto';
import { UpdateAwardDto } from './dto/update-award.dto';
import { ProducerIntervalResponseDto } from './dto/producer-interval-response.dto';

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
          data.winner = data.winner === 'yes' ? true : false;
          movies.push(data);
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

  public async create(createAwardDto: CreateAwardDto): Promise<Movie> {
    const award = this.moviesRepository.create(createAwardDto);
    return await this.moviesRepository.save(award);
  }

  public async findAll(): Promise<Movie[]> {
    try {
      return await this.moviesRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        `An error occurred while retrieving awards: ${error.message}`,
      );
    }
  }

  public async findOne(id: number): Promise<Movie> {
    const award = await this.moviesRepository.findOneBy({ id });
    if (!award) {
      throw new NotFoundException(`Award with ID ${id} not found`);
    }
    return award;
  }

  public async getProducerIntervals(): Promise<ProducerIntervalResponseDto> {
    const winnersMovies: Movie[] = await this.moviesRepository.find({
      where: { winner: true },
    });

    if (winnersMovies.length === 0) {
      throw new NotFoundException('No awards found');
    }

    const producersMap = new Map<string, number[]>();

    // Iterar sobre os filmes vencedores para processar os produtores
    for (const movie of winnersMovies) {
      // Dividir os produtores por vírgula e remover espaços extras
      const producersList = movie.producers
        .split(/,|and/)
        .map((producer) => producer.trim());

      // Iterar sobre cada produtor e adicionar os anos de vitória no mapa
      for (const producer of producersList) {
        if (!producersMap.has(producer)) {
          producersMap.set(producer, []);
        }
        producersMap.get(producer).push(movie.year);
      }
    }

    const minIntervals = [];
    const maxIntervals = [];

    producersMap.forEach((years, producer) => {
      years.sort((a, b) => a - b); // Ordenar os anos de vitória

      for (let i = 1; i < years.length; i++) {
        // Calcula o intervalo entre o ano atual e o ano anterior
        const interval = years[i] - years[i - 1];

        // Cria um objeto que representa o produtor e os detalhes do intervalo
        const result = {
          producer,
          interval,
          previousWin: years[i - 1],
          followingWin: years[i],
        };

        // valida se a lista de menores intervalos está vazia ou se o intervalo atual é menor que o menor intervalo atual
        if (minIntervals.length === 0 || interval < minIntervals[0].interval) {
          minIntervals.length = 0; // Limpa a lista, pois encontramos um novo menor intervalo
          minIntervals.push(result); // Adiciona o novo MAIOR intervalo à lista
        } else if (interval === minIntervals[0].interval) {
          // Se o intervalo for igual ao MENOR já encontrado, adiciona à lista
          minIntervals.push(result);
        }

        // Verifica se essa lista maldita, que não fica certa, de maiores intervalos está
        // vazia ou se o intervalo atual é maior que o maior intervalo atual
        if (maxIntervals.length === 0 || interval > maxIntervals[0].interval) {
          maxIntervals.length = 0;
          maxIntervals.push(result); // Adiciona o novo MENOR intervalo à lista
        } else if (interval === maxIntervals[0].interval) {
          maxIntervals.push(result); // Se o intervalo for igual ao MAIOR já encontrado, adiciona à lista
        }
      }
    });

    return { min: minIntervals, max: maxIntervals };
  }

  public async update(
    id: number,
    updateAwardDto: UpdateAwardDto,
  ): Promise<Movie> {
    const award = await this.moviesRepository.findOneBy({ id });
    if (!award) {
      throw new NotFoundException(`Award with ID ${id} not found`);
    }
    await this.moviesRepository.update(id, updateAwardDto);
    return await this.moviesRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    const result = await this.moviesRepository.delete(id);
    if (result === undefined || result.affected === 0) {
      throw new NotFoundException(`Award with ID ${id} not found`);
    }
  }
}
