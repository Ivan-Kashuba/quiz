import { ArrayMinSize, IsArray, IsString, Length } from 'class-validator';
import { Trim } from '../../../../../infrastructure/decorators/transform/trim';
import { ApiProperty } from '@nestjs/swagger';

export class QuestionInputModel {
  @Trim()
  @Length(10, 500)
  @ApiProperty()
  body: string;
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ApiProperty({
    description: 'Array of correct answers',
    type: [String],
    example: ['Paris', 'Lyon'],
  })
  correctAnswers: string[];
}
