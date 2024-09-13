/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AwardsService } from './awards.service';
import { Movie } from './entity/movie.entity';
import { CreateAwardDto } from './dto/create-award.dto';
import { UpdateAwardDto } from './dto/update-award.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('awards')
export class AwardsController {
  constructor(private readonly awardsService: AwardsService) {}

  @ApiOperation({ summary: 'Cria um novo prêmio' })
  @ApiResponse({ status: 201, description: 'Prêmio criado com sucesso.', type: Movie })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @Post()
  createAward(@Body() data: CreateAwardDto) {
    return this.awardsService.create(data);
  }

  @ApiOperation({ summary: 'Retorna todos os prêmios' })
  @ApiResponse({ status: 200, description: 'Lista de prêmios retornada com sucesso.', type: [Movie] })
  @Get()
  getAllAwards() {
    return this.awardsService.findAll();
  }

  @ApiOperation({ summary: 'Retorna um prêmio específico pelo ID' })
  @ApiResponse({ status: 200, description: 'Prêmio retornado com sucesso.', type: Movie })
  @ApiResponse({ status: 404, description: 'Prêmio não encontrado.' })
  @Get(':id')
  getAwardById(@Param('id') id: number) {
    return this.awardsService.findOne(id);
  }

  @ApiOperation({ summary: 'Obtém os produtores com o menor e maior intervalo entre prêmios consecutivos' })
  @ApiResponse({
    status: 200,
    description: 'Produtores com o menor e maior intervalo entre prêmios retornados com sucesso.'
  })
  @Get('producer-interval')
  getProducers() {
    return this.awardsService.getProducerIntervals();
  }

  @ApiOperation({ summary: 'Atualiza um prêmio existente' })
  @ApiResponse({ status: 200, description: 'Prêmio atualizado com sucesso.', type: Movie })
  @ApiResponse({ status: 404, description: 'Prêmio não encontrado.' })
  @Put(':id')
  updateAward(@Param('id') id: number, @Body() data: UpdateAwardDto) {
    return this.awardsService.update(id, data);
  }

  @ApiOperation({ summary: 'Remove um prêmio' })
  @ApiResponse({ status: 204, description: 'Prêmio removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Prêmio não encontrado.' })
  @Delete(':id')
  deleteAward(@Param('id') id: number) {
    return this.awardsService.remove(id);
  }
}
