import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AwardsModule } from '../awards.module';
import { Movie } from '../entity/movie.entity';
import { CreateAwardDto } from '../dto/create-award.dto';

describe('AwardsController integration tests', () => {
  let app: INestApplication;
  let movieRepository: Repository<Movie>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AwardsModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Movie],
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    movieRepository = moduleFixture.get<Repository<Movie>>(
      getRepositoryToken(Movie),
    );
  });

  afterAll(async () => {
    await app.close();
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
});
