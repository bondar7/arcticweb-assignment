'use client';

import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Loader2,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { deleteLead, getLead, type Lead } from '@/lib/api/leads';
import { getFriendlyErrorMessage, isNotFoundError } from '@/lib/api/errors';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { LeadCommentsPanel } from './lead-comments-panel';
import {
  LeadDetailSkeleton,
  LeadErrorState,
  LeadNotFoundState,
} from './lead-detail-states';
import { LeadEditForm } from './lead-edit-form';

type LeadDetailWorkspaceProps = {
  leadId: string;
};

type LeadLoadResult = {
  lead: Lead | null;
  missing: boolean;
  error: string | null;
};

async function fetchLeadLoadResult(leadId: string): Promise<LeadLoadResult> {
  try {
    const lead = await getLead(leadId);

    return {
      lead,
      missing: false,
      error: null,
    };
  } catch (loadError) {
    if (isNotFoundError(loadError)) {
      return {
        lead: null,
        missing: true,
        error: null,
      };
    }

    return {
      lead: null,
      missing: false,
      error: getFriendlyErrorMessage(loadError, 'Unable to load lead.'),
    };
  }
}

export function LeadDetailWorkspace({ leadId }: LeadDetailWorkspaceProps) {
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadLead = async () => {
    setLoading(true);
    const result = await fetchLeadLoadResult(leadId);

    setLead(result.lead);
    setMissing(result.missing);
    setError(result.error);
    setLoading(false);
  };

  useEffect(() => {
    let active = true;

    const run = async () => {
      setLoading(true);
      const result = await fetchLeadLoadResult(leadId);

      if (active) {
        setLead(result.lead);
        setMissing(result.missing);
        setError(result.error);
        setLoading(false);
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, [leadId]);

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await deleteLead(leadId);
      toast.success('Lead deleted');
      router.push('/leads');
    } catch (deleteError) {
      const message = getFriendlyErrorMessage(
        deleteError,
        'Unable to delete lead.',
      );
      toast.error(message);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <LeadDetailSkeleton />
      </main>
    );
  }

  if (missing) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-7xl items-start px-4 py-6 sm:px-6 lg:px-8">
        <div className="w-full pt-8">
          <LeadNotFoundState
            title="Lead not found"
            description="This record may have been deleted or the link is no longer valid."
            actionLabel="Back to leads"
            href="/leads"
          />
        </div>
      </main>
    );
  }

  if (error || !lead) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-7xl items-start px-4 py-6 sm:px-6 lg:px-8">
        <div className="w-full pt-8">
          <LeadErrorState
            title="Lead details are unavailable"
            description={error ?? 'Try loading the record again.'}
            onRetry={() => void loadLead()}
            onBack={() => router.push('/leads')}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="outline">
          <Link href="/leads">
            <ArrowLeft className="h-4 w-4" />
            Back to leads
          </Link>
        </Button>

        <Button
          variant="destructive"
          onClick={() => setDeleteOpen(true)}
          disabled={deleting}
        >
          <Trash2 className="h-4 w-4" />
          Delete lead
        </Button>
      </section>

      <section className="grid gap-6">
        <LeadEditForm
          lead={lead}
          onLeadUpdated={(updatedLead) => {
            setLead(updatedLead);
          }}
        />
      </section>

      <LeadCommentsPanel leadId={lead.id} />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete lead</DialogTitle>
            <DialogDescription>
              This removes the lead and its comments. The action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete lead
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
