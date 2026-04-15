'use client';

import { useParams } from 'next/navigation';

import { LeadNotFoundState } from '@/components/leads/detail/lead-detail-states';
import { LeadDetailWorkspace } from '@/components/leads/detail/lead-detail-workspace';

function normalizeParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
}

export default function LeadDetailPage() {
  const params = useParams<{ id: string | string[] }>();
  const leadId = normalizeParam(params.id);

  if (!leadId) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-7xl items-start px-4 py-6 sm:px-6 lg:px-8">
        <div className="w-full pt-8">
          <LeadNotFoundState
            title="Lead not found"
            description="The lead link is missing its identifier."
            actionLabel="Back to leads"
            href="/leads"
          />
        </div>
      </main>
    );
  }

  return <LeadDetailWorkspace leadId={leadId} />;
}
