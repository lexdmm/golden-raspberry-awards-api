import { ApiProperty } from '@nestjs/swagger';
import { ProducerIntervalDto } from './producer-interval.dto';

export class ProducerIntervalResponseDto {
  @ApiProperty({
    description:
      'Lista de produtores com o menor intervalo entre prêmios consecutivos',
    type: [ProducerIntervalDto],
  })
  min: ProducerIntervalDto[];

  @ApiProperty({
    description:
      'Lista de produtores com o maior intervalo entre prêmios consecutivos',
    type: [ProducerIntervalDto],
  })
  max: ProducerIntervalDto[];
}
