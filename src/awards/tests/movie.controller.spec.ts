import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwardsService } from '../awards.service';
import { AwardsController } from '../awards.controller';
import { Movie } from '../entity/movie.entity';

describe('AwardsController integration test', () => {
  let controller: AwardsController;
  let service: AwardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Movie],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Movie]),
      ],
      controllers: [AwardsController],
      providers: [AwardsService],
    }).compile();

    controller = module.get<AwardsController>(AwardsController);
    service = module.get<AwardsService>(AwardsService);
    await service.seedData();
  });

  it('should return producer intervals', async () => {
    const result = await controller.getProducersIntervals();
    expect(result).toBeDefined();
    expect(result.min).toBeInstanceOf(Array);
    expect(result.max).toBeInstanceOf(Array);
  });
});
