import { ApiPropertyOptional } from '@nestjs/swagger';
import { LeadStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

import { trimStringToUndefined } from '../../common/dto-transformers';

export enum LeadSortField {
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt',
}

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}

function toInteger(value: unknown, fallback: number): number {
  if (value === undefined) {
    return fallback;
  }

  const parsed = Number(value);

  return Number.isInteger(parsed) ? parsed : Number.NaN;
}

function normalizeSortField(value: unknown): LeadSortField {
  return value === undefined
    ? LeadSortField.CreatedAt
    : (value as LeadSortField);
}

function normalizeSortOrder(value: unknown): SortOrder {
  return value === undefined ? SortOrder.Desc : (value as SortOrder);
}

export class ListLeadsQueryDto {
  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @Transform(({ value }) => toInteger(value, 1))
  @IsOptional()
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({
    description: 'Page size',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @Transform(({ value }) => {
    if (value === undefined) {
      return 10;
    }

    const parsed = Number(value);

    if (Number.isNaN(parsed)) {
      return value;
    }

    if (!Number.isInteger(parsed)) {
      return parsed;
    }

    if (parsed < 1) {
      return parsed;
    }

    if (parsed > 100) {
      return 100;
    }

    return parsed;
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit = 10;

  @ApiPropertyOptional({
    enum: LeadStatus,
    enumName: 'LeadStatus',
    description: 'Filter by lead status',
  })
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @ApiPropertyOptional({
    description: 'Search by name, email, or company',
    example: 'arctic-web',
  })
  @Transform(({ value }) => trimStringToUndefined(value))
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    enum: LeadSortField,
    enumName: 'LeadSortField',
    description: 'Sort field',
    default: LeadSortField.CreatedAt,
  })
  @Transform(({ value }) => normalizeSortField(value))
  @IsOptional()
  @IsEnum(LeadSortField)
  sort = LeadSortField.CreatedAt;

  @ApiPropertyOptional({
    enum: SortOrder,
    enumName: 'SortOrder',
    description: 'Sort order',
    default: SortOrder.Desc,
  })
  @Transform(({ value }) => normalizeSortOrder(value))
  @IsOptional()
  @IsEnum(SortOrder)
  order = SortOrder.Desc;
}
