/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Movie } from '../entity/movie.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AwardsModule } from '../awards.module';

describe('Controller HTTP teste resultado de intervalos', () => {
  let app: INestApplication;
  let repository: Repository<Movie>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Movie],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Movie]),
        AwardsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    repository = moduleFixture.get<Repository<Movie>>(
      getRepositoryToken(Movie),
    );

    await app.init();
  });

  // Popula a base de dados em memória com alguns exemplos de prêmios
  beforeEach(async () => {
    await repository.save([
      { year: 1980, title: "Can't Stop the Music", studios: 'Associated Film Distribution', producers: 'Allan Carr', winner: true },
      { year: 1981, title: 'Mommie Dearest', studios: 'Paramount Pictures', producers: 'Frank Yablans', winner: true },
      { year: 1980, title: 'Xanadu', studios: 'Universal Studios', producers: 'Lawrence Gordon, John Derek', winner: false },
      { year: 1981, title: 'Endless Love', studios: 'Universal Studios, PolyGram', producers: 'Dyson Lovell', winner: false },
    ]);
  });

  // Limpa a base de dados em memória após cada teste
  afterEach(async () => {
    await repository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/awards/producer-interval (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/awards/producer-interval')
      .expect(200);

    // Espera-se que a resposta tenha as chaves min e max com os dados adequados
    expect(response.body).toHaveProperty('min');
    expect(response.body).toHaveProperty('max');

    // Checando se os dados esperados estão corretos (ajuste conforme o método getProducersInterval())
    const { min, max } = response.body;

    expect(min).toEqual([
      {
        producer: 'Allan Carr',
        interval: 1,
        previousWin: 1980,
        followingWin: 1981,
      },
    ]);

    expect(max).toEqual([
      {
        producer: 'Allan Carr',
        interval: 1,
        previousWin: 1980,
        followingWin: 1981,
      },
    ]);
  });
});
