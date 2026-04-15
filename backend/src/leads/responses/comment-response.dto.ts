import { ApiProperty } from '@nestjs/swagger';

export class CommentResponseDto {
  @ApiProperty({
    description: 'Comment identifier',
    example: '1d01df7d-6404-4df2-8f8c-9d3f6f746c1d',
  })
  id!: string;

  @ApiProperty({
    description: 'Lead identifier',
    example: 'b91f7f02-7c93-4d6a-a03e-4b9d7fcb0e9c',
  })
  leadId!: string;

  @ApiProperty({
    description: 'Comment text',
    example: 'Interested in a demo next week.',
  })
  text!: string;

  @ApiProperty({
    description: 'Creation timestamp',
    type: String,
    format: 'date-time',
  })
  createdAt!: Date;
}
