import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from '../entity/movie.entity';
import { AwardsService } from '../awards.service';

describe('ProducersService', () => {
  let service: AwardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwardsService,
        {
          provide: getRepositoryToken(Movie),
          useClass: Repository, // Mocka o repositório do TypeORM
        },
      ],
    }).compile();

    service = module.get<AwardsService>(AwardsService);
  });

  it('deve retornar os produtores com os menores e maiores intervalos entre vitórias', async () => {
    // Simula a resposta do método getWinners do service, retornando vencedores mockados
    jest.spyOn(service, 'getWinners').mockResolvedValue([
      {
        id: 1,
        year: 1980,
        title: "Can't Stop the Music",
        studios: 'Associated Film Distribution',
        producers: 'Allan Carr',
        winner: true,
      },
      {
        id: 11,
        year: 1981,
        title: 'Mommie Dearest',
        studios: 'Paramount Pictures',
        producers: 'Allan Carr',
        winner: true,
      },
      {
        id: 16,
        year: 2016,
        title: 'Inchon',
        studios: 'MGM',
        producers: 'Mitsuharu Ishii',
        winner: true,
      },
      {
        id: 21,
        year: 1981,
        title: 'The Lonely Lady',
        studios: 'Universal Studios',
        producers: 'Mitsuharu Ishii',
        winner: true,
      },
      {
        id: 31,
        year: 1985,
        title: 'Rambo: First Blood Part II',
        studios: 'Columbia Pictures',
        producers: 'Buzz Feitshans',
        winner: true,
      },
    ]);

    const result = await service.getProducerIntervals();

    expect(result.min).toEqual([
      {
        producer: 'Allan Carr',
        interval: 1,
        previousWin: 1980,
        followingWin: 1981,
      },
    ]);

    expect(result.max).toEqual([
      {
        producer: 'Mitsuharu Ishii',
        interval: 35,
        previousWin: 1981,
        followingWin: 2016,
      },
    ]);
  });

  it('deve dividir corretamente produtores e calcular os intervalos', async () => {
    // Simula vencedores com múltiplos produtores
    jest.spyOn(service, 'getWinners').mockResolvedValue([
      {
        id: 1,
        year: 1980,
        title: "Can't Stop the Music",
        studios: 'Associated Film Distribution',
        producers: 'Allan Carr',
        winner: true,
      },
      {
        id: 11,
        year: 1981,
        title: 'Mommie Dearest',
        studios: 'Paramount Pictures',
        producers: 'Allan Carr',
        winner: true,
      },
      {
        id: 16,
        year: 2016,
        title: 'Inchon',
        studios: 'MGM',
        producers: 'Mitsuharu Ishii',
        winner: true,
      },
      {
        id: 21,
        year: 1981,
        title: 'The Lonely Lady',
        studios: 'Universal Studios',
        producers: 'Mitsuharu Ishii',
        winner: true,
      },
      {
        id: 31,
        year: 1985,
        title: 'Rambo: First Blood Part II',
        studios: 'Columbia Pictures',
        producers: 'Buzz Feitshans',
        winner: true,
      },
    ]);

    const result = await service.getProducerIntervals();

    expect(result.min).toEqual([
      {
        producer: 'Allan Carr',
        interval: 1,
        previousWin: 1980,
        followingWin: 1981,
      },
    ]);

    expect(result.max).toEqual([
      {
        producer: 'Mitsuharu Ishii',
        interval: 35,
        previousWin: 1981,
        followingWin: 2016,
      },
    ]);
  });
});
