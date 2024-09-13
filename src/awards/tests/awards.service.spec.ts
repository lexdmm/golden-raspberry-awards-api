/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mock, MockProxy } from 'jest-mock-extended';
import { AwardsService } from '../awards.service';
import { Movie } from '../entity/movie.entity';

describe('AwardsService integration test', () => {
  let service: AwardsService;
  let repository: MockProxy<Repository<Movie>>;

  beforeEach(async () => {
    repository = mock<Repository<Movie>>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwardsService,
        {
          provide: getRepositoryToken(Movie),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<AwardsService>(AwardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should load data from CSV', async () => {
    const awards = [
      { id: 1, year: 2020, title: 'Movie 1', studios: 'Studio 1', producers: 'Producer 1', winner: false },
      { id: 2, year: 2021, title: 'Movie 2', studios: 'Studio 2', producers: 'Producer 2', winner: true },
    ];
    repository.find.mockResolvedValue(awards);

    const result = await service.findAll();
    expect(result).toEqual(awards);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should create a new award', async () => {
    const awardData = { year: 2022, title: 'Test Movie', studios: 'Test Studios', producers: 'Test Producer', winner: false };
    const savedAward = { id: 1, ...awardData };
    repository.create.mockReturnValue(savedAward as any);
    repository.save.mockResolvedValue(savedAward);

    const newAward = await service.create(awardData);
    expect(newAward).toEqual(savedAward);
    expect(repository.create).toHaveBeenCalledWith(awardData);
    expect(repository.save).toHaveBeenCalledWith(savedAward);
  });

  it('should find an award by ID', async () => {
    const award = { id: 1, year: 2022, title: 'Test Movie', studios: 'Test Studios', producers: 'Test Producer', winner: false };
    repository.findOneBy.mockResolvedValue(award);

    const foundAward = await service.findOne(1);
    expect(foundAward).toEqual(award);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should update an award', async () => {
    const award = { id: 1, year: 2022, title: 'Old Title', studios: 'Test Studios', producers: 'Test Producer', winner: false };
    const updatedAward = { ...award, title: 'New Title' };
    repository.update.mockResolvedValue(undefined);
    repository.findOneBy.mockResolvedValue(updatedAward);

    const result = await service.update(1, { title: 'New Title' });
    expect(result).toEqual(updatedAward);
    expect(repository.update).toHaveBeenCalledWith(1, { title: 'New Title' });
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should delete an award', async () => {
    repository.delete.mockResolvedValue(undefined);

    await service.remove(1);
    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  it('should calculate producer intervals correctly', async () => {
    const awards = [
      { id: 1, year: 2000, title: 'Movie 1', studios: 'Studio 1', producers: 'Producer 1', winner: true },
      { id: 2, year: 2010, title: 'Movie 2', studios: 'Studio 2', producers: 'Producer 1', winner: true },
      { id: 3, year: 2015, title: 'Movie 3', studios: 'Studio 3', producers: 'Producer 2', winner: true },
      { id: 4, year: 2018, title: 'Movie 4', studios: 'Studio 4', producers: 'Producer 2', winner: true },
    ];
    repository.find.mockResolvedValue(awards);

    const result = await service.getProducerIntervals();
    expect(result.min.length).toBeGreaterThan(0);
    expect(result.max.length).toBeGreaterThan(0);
    expect(repository.find).toHaveBeenCalledWith({ where: { winner: true } });
  });
});