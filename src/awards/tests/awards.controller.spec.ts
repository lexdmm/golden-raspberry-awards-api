import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AwardsService } from '../awards.service';
import { AwardsController } from '../awards.controller';

describe('ProducersController teste de integração', () => {
  let app: INestApplication;
  const producersService = { getProducerIntervals: jest.fn() }; // Mock do Service

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AwardsController],
      providers: [
        {
          provide: AwardsService,
          useValue: producersService, // Usa o mock do service
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close(); // Fecha a aplicação após os testes
  });

  it('/awards/producers (GET) - Deve retornar os produtores com os menores e maiores intervalos entre vitórias', async () => {
    producersService.getProducerIntervals.mockResolvedValue({
      min: [
        {
          producer: 'Bo Derek',
          interval: 0,
          previousWin: 1984,
          followingWin: 1984,
        },
      ],
      max: [
        {
          producer: 'Allan Carr',
          interval: 4,
          previousWin: 1980,
          followingWin: 1984,
        },
      ],
    });

    return request(app.getHttpServer())
      .get('/awards/producers')
      .expect(200)
      .expect((res) => {
        // Valida a estrutura de retorno do JSON
        expect(res.body).toHaveProperty('min');
        expect(res.body).toHaveProperty('max');

        // Verifica que o intervalo mínimo retornado está correto
        expect(res.body.min).toEqual([
          {
            producer: 'Bo Derek',
            interval: 0,
            previousWin: 1984,
            followingWin: 1984,
          },
        ]);

        // Verifica que o intervalo máximo retornado está correto
        expect(res.body.max).toEqual([
          {
            producer: 'Allan Carr',
            interval: 4,
            previousWin: 1980,
            followingWin: 1984,
          },
        ]);
      });
  });
});
