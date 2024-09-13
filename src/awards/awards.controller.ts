/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AwardsService } from './awards.service';
import { Movie } from './entity/movie.entity';
import { CreateAwardDto } from './dto/create-award.dto';
import { UpdateAwardDto } from './dto/update-award.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProducerIntervalResponseDto } from './dto/producer-interval-response.dto';

@ApiTags('Awards')
@Controller('awards')
export class AwardsController {
  constructor(private readonly awardsService: AwardsService) {}

  @ApiOperation({ summary: 'Cria um novo prêmio' })
  @ApiResponse({ status: 201, description: 'Prêmio criado com sucesso.', type: Movie })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
  @Post()
  createAward(@Body() data: CreateAwardDto) {
    try {
    return this.awardsService.create(data);
    } catch (error) {
      if (error.message) {
        throw new HttpException(error.message, error.status);
      }
      throw new HttpException(error, 500);
    }
  }

  @ApiOperation({ summary: 'Retorna todos os prêmios' })
  @ApiResponse({ status: 200, description: 'Lista de prêmios retornada com sucesso.', type: [Movie] })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
  @Get()
  getAllAwards() {
    try {
      return this.awardsService.findAll();
    } catch (error) {
      if (error.message) {
        throw new HttpException(error.message, error.status);
      }
      throw new HttpException(error, 500);
    }
  }

  @ApiOperation({ summary: 'Obtém os produtores com o menor e maior intervalo entre prêmios consecutivos' })
  @ApiResponse({
    status: 200,
    description: 'Produtores com o menor e maior intervalo entre prêmios retornados com sucesso.',
    type: ProducerIntervalResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Intervalo de prêmios não encontrado.' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
  @Get('/producers')
  getProducers() {
    try {
      return this.awardsService.getProducerIntervals();
    } catch (error) {
      if (error.message) {
        throw new HttpException(error.message, error.status);
      }
      throw new HttpException(error, 500);
    }
  }

  @ApiOperation({ summary: 'Retorna um prêmio específico pelo ID' })
  @ApiResponse({ status: 200, description: 'Prêmio retornado com sucesso.', type: Movie })
  @ApiResponse({ status: 404, description: 'Prêmio não encontrado.' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
  @Get(':id')
  getAwardById(@Param('id') id: number) {
    try {
      return this.awardsService.findOne(id);
    } catch (error) {
      if (error.message) {
        throw new HttpException(error.message, error.status);
      }
      throw new HttpException(error, 500);
    }
  }

  @ApiOperation({ summary: 'Atualiza um prêmio existente' })
  @ApiResponse({ status: 200, description: 'Prêmio atualizado com sucesso.', type: Movie })
  @ApiResponse({ status: 404, description: 'Prêmio não encontrado.' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
  @Put(':id')
  updateAward(@Param('id') id: number, @Body() data: UpdateAwardDto) {
    try {
      return this.awardsService.update(id, data);
    } catch (error) {
      if (error.message) {
        throw new HttpException(error.message, error.status);
      }
      throw new HttpException(error, 500);
    }
  }

  @ApiOperation({ summary: 'Remove um prêmio' })
  @ApiResponse({ status: 204, description: 'Prêmio removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Prêmio não encontrado.' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
  @Delete(':id')
  deleteAward(@Param('id') id: number) {
    try {
      return this.awardsService.remove(id);
    } catch (error) {
      if (error.message) {
        throw new HttpException(error.message, error.status);
      }
      throw new HttpException(error, 500);
    }
  }
}
