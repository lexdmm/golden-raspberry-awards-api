import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString } from 'class-validator';

export class CreateAwardDto {
  @ApiProperty({
    description: 'O ano em que o filme foi indicado ou venceu o prêmio',
    example: 1980,
  })
  @IsInt()
  year: number;

  @ApiProperty({
    description: 'O título do filme',
    example: "Can't Stop the Music",
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'O estúdio responsável pelo filme',
    example: 'Associated Film Distribution',
  })
  @IsString()
  studios: string;

  @ApiProperty({
    description:
      'Os produtores do filme, separados por vírgula, se houver mais de um',
    example: 'Allan Carr, Cecelia Ahern',
  })
  @IsString()
  producers: string;

  @ApiProperty({
    description: 'Indica se o filme foi o vencedor do prêmio de Pior Filme',
    example: true,
  })
  @IsBoolean()
  winner: boolean;
}
