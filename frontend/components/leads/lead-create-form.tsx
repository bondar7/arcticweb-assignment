'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createLead } from '@/lib/api/leads';
import { getFriendlyErrorMessage } from '@/lib/api/errors';
import {
  buildCreateLeadPayload,
  createLeadFormSchema,
  type CreateLeadFormInputValues,
  type CreateLeadFormValues,
} from '@/lib/forms/leads';
import { leadStatusValues } from '@/lib/types/leads';

import { leadStatusLabels, sanitizeLeadValueInput } from './lead-utils';

type LeadCreateFormProps = {
  onCreated: () => void;
  embedded?: boolean;
};

export function LeadCreateForm({
  onCreated,
  embedded = false,
}: LeadCreateFormProps) {
  const [apiError, setApiError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateLeadFormInputValues, undefined, CreateLeadFormValues>({
    resolver: zodResolver(createLeadFormSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      status: 'NEW',
      value: '',
      notes: '',
    },
  });

  async function onSubmit(values: CreateLeadFormValues) {
    setApiError(null);

    try {
      await createLead(buildCreateLeadPayload(values));
      toast.success('Lead created');
      reset({
        name: '',
        email: '',
        company: '',
        status: 'NEW',
        value: '',
        notes: '',
      });
      onCreated();
    } catch (error) {
      const message = getFriendlyErrorMessage(
        error,
        'Unable to create the lead right now.',
      );
      setApiError(message);
      toast.error(message);
    }
  }

  const formContent = (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      {apiError ? (
        <Alert className="border-destructive/20 bg-destructive/5">
          <AlertTitle>Could not create lead</AlertTitle>
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-2">
        <Label htmlFor="lead-name">Name</Label>
        <Input id="lead-name" {...register('name')} disabled={isSubmitting} />
        {errors.name ? (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="lead-email">Email</Label>
        <Input
          id="lead-email"
          type="email"
          placeholder="sales@company.com"
          {...register('email')}
          disabled={isSubmitting}
        />
        {errors.email ? (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="lead-company">Company</Label>
        <Input
          id="lead-company"
          {...register('company')}
          disabled={isSubmitting}
        />
        {errors.company ? (
          <p className="text-sm text-destructive">{errors.company.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="lead-status">Status</Label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select
              value={field.value ?? 'NEW'}
              onValueChange={field.onChange}
              disabled={isSubmitting}
            >
              <SelectTrigger id="lead-status">
                <SelectValue placeholder="Choose status" />
              </SelectTrigger>
              <SelectContent>
                {leadStatusValues.map((item) => (
                  <SelectItem key={item} value={item}>
                    {leadStatusLabels[item]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.status ? (
          <p className="text-sm text-destructive">{errors.status.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="lead-value">Value</Label>
        <Input
          id="lead-value"
          inputMode="decimal"
          pattern="[0-9]*[.]?[0-9]*"
          placeholder="12500"
          {...register('value')}
          onInput={(event) => {
            const input = event.currentTarget;
            input.value = sanitizeLeadValueInput(input.value);
          }}
          disabled={isSubmitting}
        />
        {errors.value ? (
          <p className="text-sm text-destructive">{errors.value.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="lead-notes">Notes</Label>
        <Textarea
          id="lead-notes"
          rows={4}
          placeholder="Short note about the lead"
          {...register('notes')}
          disabled={isSubmitting}
        />
        {errors.notes ? (
          <p className="text-sm text-destructive">{errors.notes.message}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving
            </>
          ) : (
            'Create lead'
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            reset({
              name: '',
              email: '',
              company: '',
              status: 'NEW',
              value: '',
              notes: '',
            })
          }
          disabled={isSubmitting}
        >
          Clear form
        </Button>
      </div>
    </form>
  );

  if (embedded) {
    return formContent;
  }

  return (
    <Card className="border-line/70 bg-surface/90 shadow-soft">
      <CardHeader>
        <CardTitle className="text-xl">Create lead</CardTitle>
        <CardDescription>
          Add a new contact and start tracking the next step.
        </CardDescription>
      </CardHeader>
      <CardContent>{formContent}</CardContent>
    </Card>
  );
}
