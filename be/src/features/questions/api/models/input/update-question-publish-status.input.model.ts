import { IsBoolean } from 'class-validator';

export class UpdateQuestionPublishStatusModel {
  @IsBoolean()
  published: boolean;
}
