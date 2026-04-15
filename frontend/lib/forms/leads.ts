import { z } from 'zod';

import type {
  CreateCommentInput,
  CreateLeadInput,
  Lead,
  UpdateLeadInput,
} from '@/lib/types/leads';
import { leadStatusValues } from '@/lib/types/leads';

const trimToUndefined = (value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const normalizeNumberInput = (value: unknown): unknown => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return undefined;
    }

    return trimmed;
  }

  return value;
};

const optionalStringSchema = (maxLength: number) =>
  z.preprocess(trimToUndefined, z.string().max(maxLength).optional());

const optionalEmailSchema = z.preprocess(
  trimToUndefined,
  z.string().email('Enter a valid email address').optional(),
);

const numberStringSchema = z
  .string()
  .regex(/^\d+(\.\d+)?$/, 'Enter a valid number')
  .transform((value) => Number(value))
  .refine((value) => Number.isFinite(value), 'Enter a valid number');

const optionalNumberSchema = z.preprocess(
  normalizeNumberInput,
  numberStringSchema.optional(),
);

export const createLeadFormSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required'),
    email: optionalEmailSchema,
    company: optionalStringSchema(255),
    status: z.enum(leadStatusValues).optional(),
    value: optionalNumberSchema,
    notes: optionalStringSchema(500),
  })
  .strict();

export const editLeadFormSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(120),
    email: optionalEmailSchema,
    company: optionalStringSchema(255),
    status: z.enum(leadStatusValues),
    value: optionalNumberSchema,
    notes: optionalStringSchema(500),
  })
  .strict();

export const createCommentFormSchema = z
  .object({
    text: z.string().trim().min(1, 'Comment is required').max(500),
  })
  .strict();

export type CreateLeadFormInputValues = z.input<typeof createLeadFormSchema>;
export type CreateLeadFormValues = z.infer<typeof createLeadFormSchema>;
export type EditLeadFormInputValues = z.input<typeof editLeadFormSchema>;
export type EditLeadFormValues = z.infer<typeof editLeadFormSchema>;
export type CreateCommentFormValues = z.infer<typeof createCommentFormSchema>;

export type LeadUpdateDirtyFields = Partial<
  Record<keyof EditLeadFormValues, boolean>
>;

type NullableUpdateValue = string | number;

function shouldIncludeField(
  dirtyFields: LeadUpdateDirtyFields | undefined,
  field: keyof EditLeadFormValues,
): boolean {
  return dirtyFields?.[field] === true;
}

function resolveNullableFieldUpdate<T extends NullableUpdateValue>(
  currentValue: T | null,
  nextValue: T | undefined,
): T | null | undefined {
  if (nextValue === undefined) {
    return currentValue === null ? undefined : null;
  }

  return nextValue !== currentValue ? nextValue : undefined;
}

function applyDirtyNullableFieldUpdate<T extends NullableUpdateValue>({
  dirtyFields,
  field,
  currentValue,
  nextValue,
  assign,
}: {
  dirtyFields: LeadUpdateDirtyFields | undefined;
  field: keyof EditLeadFormValues;
  currentValue: T | null;
  nextValue: T | undefined;
  assign: (value: T | null) => void;
}) {
  if (!shouldIncludeField(dirtyFields, field)) {
    return;
  }

  const resolvedValue = resolveNullableFieldUpdate(currentValue, nextValue);

  if (resolvedValue !== undefined) {
    assign(resolvedValue);
  }
}

function normalizeCreateString(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeUpdateString(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function buildCreateLeadPayload(
  values: CreateLeadFormValues,
): CreateLeadInput {
  const payload: CreateLeadInput = {
    name: values.name.trim(),
  };

  const email = normalizeCreateString(values.email);
  if (email !== undefined) {
    payload.email = email;
  }

  const company = normalizeCreateString(values.company);
  if (company !== undefined) {
    payload.company = company;
  }

  if (values.status !== undefined) {
    payload.status = values.status;
  }

  if (values.value !== undefined) {
    payload.value = values.value;
  }

  const notes = normalizeCreateString(values.notes);
  if (notes !== undefined) {
    payload.notes = notes;
  }

  return payload;
}

export function buildUpdateLeadPayload(
  values: EditLeadFormValues,
  currentLead: Lead,
  dirtyFields?: LeadUpdateDirtyFields,
): UpdateLeadInput {
  const payload: UpdateLeadInput = {};

  // Dirty fields are the signal for explicit clears in RHF-driven forms.
  if (shouldIncludeField(dirtyFields, 'name') && values.name !== undefined) {
    const nextName = values.name.trim();
    if (nextName !== currentLead.name) {
      payload.name = nextName;
    }
  }

  applyDirtyNullableFieldUpdate<string>({
    dirtyFields,
    field: 'email',
    currentValue: currentLead.email,
    nextValue: normalizeUpdateString(values.email),
    assign: (value) => {
      payload.email = value;
    },
  });

  applyDirtyNullableFieldUpdate<string>({
    dirtyFields,
    field: 'company',
    currentValue: currentLead.company,
    nextValue: normalizeUpdateString(values.company),
    assign: (value) => {
      payload.company = value;
    },
  });

  if (
    shouldIncludeField(dirtyFields, 'status') &&
    values.status !== undefined
  ) {
    if (values.status !== currentLead.status) {
      payload.status = values.status;
    }
  }

  applyDirtyNullableFieldUpdate<number>({
    dirtyFields,
    field: 'value',
    currentValue: currentLead.value,
    nextValue: values.value,
    assign: (value) => {
      payload.value = value;
    },
  });

  applyDirtyNullableFieldUpdate<string>({
    dirtyFields,
    field: 'notes',
    currentValue: currentLead.notes,
    nextValue: normalizeUpdateString(values.notes),
    assign: (value) => {
      payload.notes = value;
    },
  });

  return payload;
}

export function buildCreateCommentPayload(
  values: CreateCommentFormValues,
): CreateCommentInput {
  return {
    text: values.text.trim(),
  };
}
