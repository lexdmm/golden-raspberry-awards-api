/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AwardsModule } from '../awards.module';
import { Movie } from '../entity/movie.entity';
import { CreateAwardDto } from '../dto/create-award.dto';
import { AwardsService } from '../awards.service';

describe('AwardsController integration tests', () => {
  let app: INestApplication;
  let service: AwardsService;
  let movieRepository: Repository<Movie>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Movie],
          synchronize: true,
        }),
        AwardsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    movieRepository = moduleFixture.get<Repository<Movie>>(
      getRepositoryToken(Movie),
    );
    service = moduleFixture.get<AwardsService>(AwardsService);
  });

  it('/awards (POST) - should create a new award', async () => {
    const createAwardDto: CreateAwardDto = {
      producers: 'Jhon Miller',
      title: 'Post Movie',
      studios: 'Tabajara',
      year: 2021,
      winner: true,
    };

    const response = await request(app.getHttpServer())
      .post('/awards')
      .send(createAwardDto)
      .expect(201);

    expect(response.body).toMatchObject(createAwardDto);
  });

  it('/awards (GET) - should return all awards', async () => {
    const response = await request(app.getHttpServer())
      .get('/awards')
      .expect(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/awards/:id (GET) - should return a specific award', async () => {
    const award = await movieRepository.save({
      producers: 'Jhon Miller',
      title: 'Another Movie',
      studios: 'Tabajara',
      year: 2020,
      winner: false,
    });

    const response = await request(app.getHttpServer())
      .get(`/awards/${award.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      producers: 'Jhon Miller',
      title: 'Another Movie',
      studios: 'Tabajara',
      year: 2020,
      winner: false,
    });
  });

  it('/awards/:id (PUT) - should update an existing award', async () => {
    const award = await movieRepository.save({
      producers: 'Jhon Miller',
      title: 'Another Movie',
      studios: 'Tabajara',
      year: 2020,
      winner: false,
    });

    const updateDto = { title: 'Updated Movie' };

    const response = await request(app.getHttpServer())
      .put(`/awards/${award.id}`)
      .send(updateDto)
      .expect(200);

    expect(response.body.title).toEqual('Updated Movie');
  });

  it('/awards/:id (DELETE) - should delete an award', async () => {
    const award = await movieRepository.save({
      producers: 'Jeff Murray',
      title: 'Another Movie',
      studios: 'Tabajara',
      year: 2019,
      winner: true,
    });

    await request(app.getHttpServer())
      .delete(`/awards/${award.id}`)
      .expect(200);

    const findDeleted = await movieRepository.findOne({
      where: { id: award.id },
    });
    expect(findDeleted).toBeNull();
  });

  it('/producers-interval (GET) - should calculate producer intervals correctly', async () => {
    const movies: CreateAwardDto[] = [
      {
        producers: 'Joel Silver',
        title: 'Movie 1',
        studios: 'Studio 1',
        year: 1990,
        winner: true,
      },
      {
        producers: 'Joel Silver',
        title: 'Movie 2',
        studios: 'Studio 2',
        year: 1991,
        winner: true,
      },
      {
        producers: 'Matthew Vaughn',
        title: 'Movie 3',
        studios: 'Studio 3',
        year: 2002,
        winner: true,
      },
      {
        producers: 'Matthew Vaughn',
        title: 'Movie 4',
        studios: 'Studio 4',
        year: 2015,
        winner: true,
      },
    ];

    await movieRepository.save(movies);

    const response = await request(app.getHttpServer())
      .get(`/awards/producers-interval`)
      .expect(200);

    expect(response.body).toEqual({
      min: [
        {
          producer: 'Joel Silver',
          interval: 1,
          previousWin: 1990,
          followingWin: 1991,
        },
      ],
      max: [
        {
          producer: 'Matthew Vaughn',
          interval: 13,
          previousWin: 2002,
          followingWin: 2015,
        },
      ],
    });
  });

  it('/awards/producers-interval (GET) - should ensure that the data obtained is in accordance with the data by seed data provided in the proposal in csv', async () => {
    await service.seedData();

    const response = await request(app.getHttpServer())
      .get('/awards/producers-interval')
      .expect(200);

    const expectedResponse = {
      min: [
        {
          producer: 'Joel Silver',
          interval: 1,
          previousWin: 1990,
          followingWin: 1991,
        },
      ],
      max: [
        {
          producer: 'Matthew Vaughn',
          interval: 13,
          previousWin: 2002,
          followingWin: 2015,
        },
      ],
    };

    // Compara a resposta da API com o retorno esperado
    expect(response.body).toEqual(expectedResponse);
  });
});
