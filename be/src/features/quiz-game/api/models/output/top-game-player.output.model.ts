import { UserStatisticOutputModel } from './user-statistic.output.model';
import { PlayerOutputModel } from './player.output.model';
import { ApiProperty } from '@nestjs/swagger';

export class TopGamePlayerOutputModel extends UserStatisticOutputModel {
  @ApiProperty({ type: PlayerOutputModel })
  player: PlayerOutputModel;
}
