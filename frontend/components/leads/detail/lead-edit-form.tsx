'use client';

import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Copy, Loader2, RotateCcw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { type Lead, updateLead } from '@/lib/api/leads';
import { getFriendlyErrorMessage } from '@/lib/api/errors';
import { copyToClipboard } from '@/lib/copy-to-clipboard';
import {
  buildUpdateLeadPayload,
  editLeadFormSchema,
  type EditLeadFormInputValues,
  type EditLeadFormValues,
  type LeadUpdateDirtyFields,
} from '@/lib/forms/leads';
import { leadStatusValues, type LeadStatus } from '@/lib/types/leads';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

import {
  formatLeadDate,
  getLeadStatusClassName,
  leadStatusLabels,
  sanitizeLeadValueInput,
} from '../lead-utils';

type LeadEditFormProps = {
  lead: Lead;
  onLeadUpdated: (lead: Lead) => void;
};

export function LeadEditForm({ lead, onLeadUpdated }: LeadEditFormProps) {
  const defaultValues = useMemo<EditLeadFormInputValues>(
    () => ({
      name: lead.name,
      email: lead.email ?? '',
      company: lead.company ?? '',
      status: lead.status,
      value: lead.value === null ? '' : Number(lead.value).toString(),
      notes: lead.notes ?? '',
    }),
    [lead],
  );

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { dirtyFields, errors, isSubmitting, isDirty },
  } = useForm<EditLeadFormInputValues, undefined, EditLeadFormValues>({
    resolver: zodResolver(editLeadFormSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  useEffect(() => {
    reset(defaultValues);
    setSubmitError(null);
  }, [defaultValues, reset]);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    const payload = buildUpdateLeadPayload(
      values,
      lead,
      dirtyFields as LeadUpdateDirtyFields,
    );
    if (Object.keys(payload).length === 0) {
      toast.message('No changes to save.');
      return;
    }

    try {
      const updatedLead = await updateLead(lead.id, payload);
      onLeadUpdated(updatedLead);
      setLastSavedAt(new Date().toISOString());
      toast.success('Lead updated');
    } catch (error) {
      const message = getFriendlyErrorMessage(error);
      setSubmitError(message);
      toast.error(message);
    }
  });

  const currentStatus = watch('status');
  const statusBadgeClass = getLeadStatusClassName(lead.status);

  const copyLeadId = async () => {
    const copiedSuccessfully = await copyToClipboard(lead.id);

    if (copiedSuccessfully) {
      toast.success('Lead ID copied');
    } else {
      toast.error('Unable to copy right now.');
    }
  };

  return (
    <Card className="border-line/70 bg-surface/90 shadow-soft">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={statusBadgeClass}>{lead.status}</Badge>
          <Badge variant="secondary">Lead</Badge>
          {lastSavedAt ? (
            <span className="text-xs text-muted-foreground">
              Saved just now
            </span>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-2xl">Lead details</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void copyLeadId()}
          >
            <Copy className="h-4 w-4" />
            Copy Lead ID
          </Button>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>Created {formatLeadDate(lead.createdAt)}</span>
          <span>Updated {formatLeadDate(lead.updatedAt)}</span>
        </div>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={onSubmit}>
          {submitError ? (
            <Alert>
              <AlertTitle>Update failed</AlertTitle>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          ) : null}

          <div className="grid gap-2">
            <Label htmlFor="lead-name">Name</Label>
            <Input
              id="lead-name"
              placeholder="Acme Studio"
              {...register('name')}
            />
            {errors.name ? (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            ) : null}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="lead-email">Email</Label>
              <Input
                id="lead-email"
                type="email"
                placeholder="sales@acme.com"
                {...register('email')}
              />
              {errors.email ? (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lead-company">Company</Label>
              <Input
                id="lead-company"
                placeholder="Acme"
                {...register('company')}
              />
              {errors.company ? (
                <p className="text-sm text-destructive">
                  {errors.company.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="lead-status">Status</Label>
              <Select
                value={currentStatus}
                onValueChange={(value) =>
                  setValue('status', value as LeadStatus, { shouldDirty: true })
                }
              >
                <SelectTrigger id="lead-status">
                  <SelectValue placeholder="Choose status" />
                </SelectTrigger>
                <SelectContent>
                  {leadStatusValues.map((status) => (
                    <SelectItem key={status} value={status}>
                      {leadStatusLabels[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status ? (
                <p className="text-sm text-destructive">
                  {errors.status.message}
                </p>
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
              />
              {errors.value ? (
                <p className="text-sm text-destructive">
                  {errors.value.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lead-notes">Notes</Label>
            <Textarea
              id="lead-notes"
              rows={5}
              placeholder="Short internal note"
              {...register('notes')}
            />
            {errors.notes ? (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Save changes
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting || !isDirty}
              onClick={() => reset(defaultValues)}
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
