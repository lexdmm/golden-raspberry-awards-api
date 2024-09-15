/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AwardsService } from '../awards.service';
import { Movie } from '../entity/movie.entity';
import { MockType, repositoryMockFactory } from './mocks/repository.mock';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

describe('AwardsService test', () => {
  let service: AwardsService;
  let repository: MockType<Repository<Movie>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwardsService,
        { provide: getRepositoryToken(Movie), useFactory: repositoryMockFactory },
      ],
    }).compile();

    service = module.get<AwardsService>(AwardsService);
    repository = module.get(getRepositoryToken(Movie));
    repository.update = jest.fn();
  });

  describe('findAll', () => {
    it('should return all awards', async () => {
      const awards = [{ id: 1, title: 'Award 1' }, { id: 2, title: 'Award 2' }];
      repository.find.mockResolvedValue(awards);

      expect(await service.findAll()).toEqual(awards);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      repository.find.mockRejectedValue(new Error('Repository error'));

      await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    it('should return an award by ID', async () => {
      const award = { id: 1, title: 'Award 1' };
      repository.findOneBy.mockResolvedValue(award);

      expect(await service.findOne(1)).toEqual(award);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if the award does not exist', async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an award successfully', async () => {
      const updateDto = { title: 'Updated Title' };
      const existingAward = { id: 1, title: 'Original Title' };
      const updatedAward = { id: 1, title: 'Updated Title' };

      repository.findOneBy.mockResolvedValue(existingAward);
      repository.update.mockResolvedValue(undefined);
      repository.findOneBy.mockResolvedValue(updatedAward);

      expect(await service.update(1, updateDto)).toEqual(updatedAward);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.update).toHaveBeenCalledWith(1, updateDto);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if the award does not exist', async () => {
      const updateDto = { title: 'Updated Title' };
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.update(1, updateDto)).rejects.toThrow(NotFoundException);
    });
  });


  describe('remove', () => {
    it('should remove an award successfully', async () => {
      repository.delete.mockResolvedValue({ affected: 1 });

      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if the award does not exist', async () => {
      repository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });


  describe('getProducersInterval', () => {
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

    it('should throw NotFoundException if no awards found', async () => {
      repository.find.mockResolvedValue([]);

      await expect(service.getProducerIntervals()).rejects.toThrow(NotFoundException);
    });
  });
});