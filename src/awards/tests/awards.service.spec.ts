import { Test, TestingModule } from '@nestjs/testing';
import { AwardsService } from '../awards.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from '../entity/movie.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateAwardDto } from '../dto/create-award.dto';

const mockAwardEntity: Movie = {
  id: 1,
  producers: 'Michael Bay',
  title: 'Transformers: Revenge of the Fallen (Extended Cut)',
  studios: 'Paramount Pictures',
  year: 2009,
  winner: true,
};

const mockAwardsRepository = () => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('AwardsService unit tests', () => {
  let service: AwardsService;
  let repository: Repository<Movie>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwardsService,
        {
          provide: getRepositoryToken(Movie),
          useFactory: mockAwardsRepository,
        },
      ],
    }).compile();

    service = module.get<AwardsService>(AwardsService);
    repository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  describe('findAll', () => {
    it('should return an array of awards', async () => {
      const awards = [mockAwardEntity];
      jest.spyOn(repository, 'find').mockResolvedValue(awards);

      expect(await service.findAll()).toEqual(awards);
    });
  });

  describe('findOne', () => {
    it('should return an award by id', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockAwardEntity);

      expect(await service.findOne(1)).toEqual(mockAwardEntity);
    });

    it('should throw a NotFoundException if the award does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should successfully insert a new award', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(mockAwardEntity);

      const createAwardDto: CreateAwardDto = {
        producers: 'Michael Bay',
        title: 'Transformers: Revenge of the Fallen',
        studios: 'Paramount Pictures',
        year: 2009,
        winner: true,
      };

      expect(await service.create(createAwardDto)).toEqual(mockAwardEntity);
    });
  });

  describe('update', () => {
    it('should update an award', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockAwardEntity);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mockAwardEntity,
        title: 'Transformers: Revenge of the Fallen (Extended Cut)',
      });

      const updateDto = {
        title: 'Transformers: Revenge of the Fallen (Extended Cut)',
      };

      expect(await service.update(1, updateDto)).toEqual({
        ...mockAwardEntity,
        title: 'Transformers: Revenge of the Fallen (Extended Cut)',
      });
    });

    it('should throw a NotFoundException if the award does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update(999, { title: 'New Title' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete an award', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockAwardEntity);
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 1, raw: {} });

      expect(await service.remove(1)).toBeUndefined();
    });

    it('should throw a NotFoundException if the award does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getProducerIntervals', () => {
    it('should return the producer with the smallest and largest award interval', async () => {
      const mockAwardEntities: Movie[] = [
        {
          id: 0,
          producers: 'Michael Bay and Jerry Bruckheimer',
          year: 2007,
          winner: true,
          title: 'Movie 1',
          studios: 'Tabajara',
        },
        {
          producers: 'Jerry Bruckheimer',
          year: 2003,
          winner: true,
          id: 0,
          title: 'Movie 2',
          studios: 'Tabajara',
        },
        // eslint-disable-next-line prettier/prettier
        {
          producers: 'Kathleen Kennedy, Frank Marshall',
          year: 2001,
          winner: true,
          id: 0,
          title: 'Movie 3',
          studios: 'Tabajara',
        },
        {
          producers: 'Frank Marshall',
          year: 2012,
          winner: true,
          id: 0,
          title: 'Movie 4',
          studios: 'Tabajara',
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(mockAwardEntities);

      const result = await service.getProducerIntervals();

      expect(result.min).toEqual([
        {
          producer: 'Jerry Bruckheimer',
          interval: 4,
          previousWin: 2003,
          followingWin: 2007,
        },
      ]);

      expect(result.max).toEqual([
        {
          followingWin: 2012,
          interval: 11,
          previousWin: 2001,
          producer: 'Frank Marshall',
        },
      ]);
    });

    it('should return empty arrays if there are no winners', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([]);

      expect.assertions(1);
      try {
        await service.getProducerIntervals();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
