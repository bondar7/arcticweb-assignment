import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

import { trimString } from '../../common/dto-transformers';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment text',
    minLength: 1,
    maxLength: 500,
    example: 'Interested in a demo next week.',
  })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @Length(1, 500)
  text!: string;
}
