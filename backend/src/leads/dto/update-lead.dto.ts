import { ApiPropertyOptional } from '@nestjs/swagger';
import { LeadStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

import {
  toNullableNumber,
  trimNullableStringToUndefined,
  trimString,
} from '../../common/dto-transformers';

export class UpdateLeadDto {
  @ApiPropertyOptional({
    description: 'Lead name. Omit to keep the current value.',
    example: 'Arctic-web Ltd.',
  })
  @Transform(({ value }) => trimString(value))
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiPropertyOptional({
    description: 'Lead email. Pass null to clear the current value.',
    example: 'sales@arctic-web.com',
    nullable: true,
  })
  @Transform(({ value }) => trimNullableStringToUndefined(value))
  @IsOptional()
  @IsEmail()
  email?: string | null;

  @ApiPropertyOptional({
    description: 'Company name. Pass null to clear the current value.',
    example: 'Arctic-web',
    nullable: true,
  })
  @Transform(({ value }) => trimNullableStringToUndefined(value))
  @IsOptional()
  @IsString()
  company?: string | null;

  @ApiPropertyOptional({
    enum: LeadStatus,
    enumName: 'LeadStatus',
    description: 'Lead status. Omit to keep the current value.',
    example: LeadStatus.NEW,
  })
  @ValidateIf((_, value) => value !== undefined)
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @ApiPropertyOptional({
    description: 'Estimated deal value. Pass null to clear the current value.',
    example: 12500,
    nullable: true,
  })
  @Transform(({ value }) => toNullableNumber(value))
  @IsOptional()
  @IsNumber()
  value?: number | null;

  @ApiPropertyOptional({
    description: 'Internal notes. Pass null to clear the current value.',
    example: 'Call back after the budget review.',
    nullable: true,
  })
  @Transform(({ value }) => trimNullableStringToUndefined(value))
  @IsOptional()
  @IsString()
  notes?: string | null;
}
