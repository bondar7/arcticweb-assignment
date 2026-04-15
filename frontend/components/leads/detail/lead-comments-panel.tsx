'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, MessageSquarePlus, RefreshCcw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  createLeadComment,
  getLeadComments,
  type LeadComment,
} from '@/lib/api/leads';
import { getFriendlyErrorMessage } from '@/lib/api/errors';
import {
  buildCreateCommentPayload,
  createCommentFormSchema,
  type CreateCommentFormValues,
} from '@/lib/forms/leads';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import {
  LeadCommentsEmptyState,
  LeadCommentsLoadingState,
} from './lead-detail-states';

type LeadCommentsPanelProps = {
  leadId: string;
};

type LeadCommentsLoadResult = {
  comments: LeadComment[] | null;
  error: string | null;
};

function formatCommentDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

async function fetchLeadCommentsLoadResult(
  leadId: string,
): Promise<LeadCommentsLoadResult> {
  try {
    const comments = await getLeadComments(leadId);

    return {
      comments,
      error: null,
    };
  } catch (loadError) {
    return {
      comments: null,
      error: getFriendlyErrorMessage(loadError, 'Unable to load comments.'),
    };
  }
}

export function LeadCommentsPanel({ leadId }: LeadCommentsPanelProps) {
  const [comments, setComments] = useState<LeadComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCommentFormValues>({
    resolver: zodResolver(createCommentFormSchema),
    defaultValues: {
      text: '',
    },
  });

  const hasComments = comments.length > 0;

  const loadComments = async () => {
    setLoading(true);
    const result = await fetchLeadCommentsLoadResult(leadId);

    if (result.comments !== null) {
      setComments(result.comments);
    }

    setError(result.error);
    setLoading(false);
  };

  useEffect(() => {
    let active = true;

    const run = async () => {
      setLoading(true);
      setComments([]);
      const result = await fetchLeadCommentsLoadResult(leadId);

      if (active) {
        if (result.comments !== null) {
          setComments(result.comments);
        }

        setError(result.error);
        setLoading(false);
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, [leadId]);

  const onSubmit = handleSubmit(async (values) => {
    setError(null);

    try {
      const createdComment = await createLeadComment(
        leadId,
        buildCreateCommentPayload(values),
      );
      setComments((current) => [...current, createdComment]);
      reset({ text: '' });
      toast.success('Comment added');
    } catch (submitError) {
      const message = getFriendlyErrorMessage(
        submitError,
        'Unable to add comment.',
      );
      setError(message);
      toast.error(message);
    }
  });

  return (
    <Card className="border-line/70 bg-surface/90 shadow-soft">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Comments</Badge>
          <span className="text-sm text-muted-foreground">
            {hasComments ? `${comments.length} notes` : 'No notes yet'}
          </span>
        </div>
        <CardTitle className="text-2xl">Follow-up log</CardTitle>
        <CardDescription className="max-w-2xl text-base leading-7">
          Keep a compact trail of calls, follow-ups, and next actions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <LeadCommentsLoadingState />
        ) : (
          <>
            {error ? (
              <div className="space-y-3">
                <Alert>
                  <AlertTitle>Comments unavailable</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void loadComments()}
                >
                  <RefreshCcw className="h-4 w-4" />
                  Try again
                </Button>
              </div>
            ) : null}

            {hasComments ? (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <article
                    key={comment.id}
                    className="rounded-lg border border-line/70 bg-background/70 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-foreground">
                        Comment
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatCommentDate(comment.createdAt)}
                      </p>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-foreground">
                      {comment.text}
                    </p>
                  </article>
                ))}
              </div>
            ) : error ? null : (
              <LeadCommentsEmptyState />
            )}
          </>
        )}

        <form className="grid gap-4" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="comment-text">Add comment</Label>
            <Textarea
              id="comment-text"
              rows={4}
              placeholder="Interested in a demo next week."
              {...register('text')}
            />
            {errors.text ? (
              <p className="text-sm text-destructive">{errors.text.message}</p>
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
                  <MessageSquarePlus className="h-4 w-4" />
                  Add comment
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => void loadComments()}
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
