import { ArrayMinSize, IsArray, IsString, Length } from 'class-validator';
import { Trim } from '../../../../../infrastructure/decorators/transform/trim';

export class QuestionInputModel {
  @Trim()
  @Length(10, 500)
  body: string;
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  correctAnswers: string[];
}
