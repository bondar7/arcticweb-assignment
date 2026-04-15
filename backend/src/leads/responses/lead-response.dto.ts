import { ApiProperty } from '@nestjs/swagger';
import { LeadStatus } from '@prisma/client';

export class LeadResponseDto {
  @ApiProperty({
    description: 'Lead identifier',
    example: 'b91f7f02-7c93-4d6a-a03e-4b9d7fcb0e9c',
  })
  id!: string;

  @ApiProperty({
    description: 'Lead name',
    example: 'Arctic-web Ltd.',
  })
  name!: string;

  @ApiProperty({
    description: 'Lead email',
    example: 'sales@arctic-web.com',
    nullable: true,
  })
  email!: string | null;

  @ApiProperty({
    description: 'Company name',
    example: 'Arctic-web',
    nullable: true,
  })
  company!: string | null;

  @ApiProperty({
    enum: LeadStatus,
    enumName: 'LeadStatus',
    description: 'Lead status',
    example: LeadStatus.NEW,
  })
  status!: LeadStatus;

  @ApiProperty({
    description: 'Estimated deal value',
    example: 12500,
    nullable: true,
  })
  value!: number | null;

  @ApiProperty({
    description: 'Internal notes',
    example: 'Call back after the budget review.',
    nullable: true,
  })
  notes!: string | null;

  @ApiProperty({
    description: 'Creation timestamp',
    type: String,
    format: 'date-time',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Update timestamp',
    type: String,
    format: 'date-time',
  })
  updatedAt!: Date;
}

export class LeadListMetaDto {
  @ApiProperty({ example: 1, minimum: 1 })
  page!: number;

  @ApiProperty({ example: 10, minimum: 1, maximum: 100 })
  limit!: number;

  @ApiProperty({ example: 0, minimum: 0 })
  total!: number;

  @ApiProperty({ example: 0, minimum: 0 })
  totalPages!: number;
}

export class LeadListResponseDto {
  @ApiProperty({
    type: () => [LeadResponseDto],
  })
  data!: LeadResponseDto[];

  @ApiProperty({
    type: () => LeadListMetaDto,
  })
  meta!: LeadListMetaDto;
}
