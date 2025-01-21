import { ApiProperty } from '@nestjs/swagger';

export class UserStatisticOutputModel {
  @ApiProperty({ type: Number })
  sumScore: number;
  @ApiProperty({ type: Number })
  avgScores: number;
  @ApiProperty({ type: Number })
  gamesCount: number;
  @ApiProperty({ type: Number })
  winsCount: number;
  @ApiProperty({ type: Number })
  lossesCount: number;
  @ApiProperty({ type: Number })
  drawsCount: number;
}
