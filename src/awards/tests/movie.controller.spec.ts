import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { AwardsService } from '../awards.service';
import { AwardsController } from '../awards.controller';
import { Movie } from '../entity/movie.entity';
import { Repository } from 'typeorm';

describe('AwardsController integration test', () => {
  let controller: AwardsController;
  let service: AwardsService;
  let repository: Repository<Movie>;

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
    repository = module.get<Repository<Movie>>(getRepositoryToken(Movie));

    await service.seedData();  });

  it('should return producer intervals', async () => {
    const result = await controller.getProducers();
    expect(result).toBeDefined();
    expect(result.min).toBeInstanceOf(Array);
    expect(result.max).toBeInstanceOf(Array);
  });

  it('should return winners', async () => {
    const result = [{ year: 2020, title: 'Worst Film', winner: 'yes' }];
    jest.spyOn(repository, 'find').mockResolvedValue(result as any);
    expect(await service.getWinners()).toBe(result);
  });
});
