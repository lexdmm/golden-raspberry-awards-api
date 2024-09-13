import { ApiProperty } from '@nestjs/swagger';

export class ProducerIntervalDto {
  @ApiProperty({ description: 'Nome do produtor', example: 'Producer 1' })
  producer: string;

  @ApiProperty({
    description: 'Intervalo entre dois prêmios consecutivos',
    example: 1,
  })
  interval: number;

  @ApiProperty({ description: 'Ano do prêmio anterior', example: 2008 })
  previousWin: number;

  @ApiProperty({ description: 'Ano do prêmio seguinte', example: 2009 })
  followingWin: number;
}
