import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LeadStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import {
  trimString,
  trimStringToUndefined,
  toOptionalNumber,
} from '../../common/dto-transformers';

export class CreateLeadDto {
  @ApiProperty({
    description: 'Lead name',
    example: 'Arctic-web Ltd.',
  })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @MinLength(1)
  name!: string;

  @ApiPropertyOptional({
    description: 'Lead email',
    example: 'sales@arctic-web.com',
  })
  @Transform(({ value }) => trimStringToUndefined(value))
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Company name',
    example: 'Arctic-web',
  })
  @Transform(({ value }) => trimStringToUndefined(value))
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({
    enum: LeadStatus,
    enumName: 'LeadStatus',
    description: 'Lead status',
    example: LeadStatus.NEW,
  })
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @ApiPropertyOptional({
    description: 'Estimated deal value',
    example: 12500,
  })
  @Transform(({ obj, key }) => toOptionalNumber(obj[key]))
  @IsOptional()
  @IsNumber()
  value?: number;

  @ApiPropertyOptional({
    description: 'Internal notes',
    example: 'Call back after the budget review.',
  })
  @Transform(({ value }) => trimStringToUndefined(value))
  @IsOptional()
  @IsString()
  notes?: string;
}
