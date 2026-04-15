'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getLeads, type LeadListResponse } from '@/lib/api/leads';
import { getFriendlyErrorMessage } from '@/lib/api/errors';
import type { LeadListMeta } from '@/lib/types/leads';

import { LeadCreateForm } from './lead-create-form';
import {
  LeadsEmptyState,
  LeadsErrorState,
  LeadsLoadingState,
} from './leads-states';
import { LeadsList } from './leads-list';
import { LeadsPagination } from './leads-pagination';
import { LeadsToolbar } from './leads-toolbar';
import {
  buildLeadListQuery,
  getLeadCountLabel,
  getLeadsListEmptyState,
  hasActiveLeadFilters,
  leadsEmptyStateAction,
} from './leads-workspace-utils';
import { useLeadsQueryState } from './use-leads-query-state';

export function LeadsWorkspace() {
  const { query, draftSearch, setDraftSearch, updateUrl, clearFilters } =
    useLeadsQueryState();
  const [data, setData] = useState<LeadListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const response = await getLeads(
          buildLeadListQuery(query),
          controller.signal,
        );

        setData(response);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(
          getFriendlyErrorMessage(err, 'Unable to load leads right now.'),
        );
        setData(null);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();

    return () => controller.abort();
  }, [query, refreshToken]);

  const listMeta: LeadListMeta = data?.meta ?? {
    page: query.page,
    limit: query.limit,
    total: 0,
    totalPages: 0,
  };

  const hasActiveFilters = hasActiveLeadFilters(query);

  const emptyState = getLeadsListEmptyState({
    hasActiveFilters,
    page: listMeta.page,
    totalPages: listMeta.totalPages,
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-4">
        <Card className="border-line/70 bg-surface/90 shadow-soft">
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="brand">Workspace</Badge>
                <Badge variant="secondary">Lead Tracker</Badge>
              </div>
              <Button type="button" onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4" />
                Add lead
              </Button>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl">Lead Tracker</CardTitle>
              <CardDescription className="max-w-3xl text-base leading-7">
                Search contacts, filter by status, and keep the current pipeline
                organized.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">
              {loading ? 'Loading leads...' : getLeadCountLabel(listMeta.total)}
            </p>
          </CardContent>
        </Card>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="w-[min(92vw,40rem)] max-h-[88vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create lead</DialogTitle>
              <DialogDescription>
                Add a new contact and keep the pipeline moving.
              </DialogDescription>
            </DialogHeader>
            <LeadCreateForm
              embedded
              onCreated={() => {
                setCreateOpen(false);
                setRefreshToken((value) => value + 1);
              }}
            />
          </DialogContent>
        </Dialog>
      </section>

      <section className="grid gap-4">
        <div className="rounded-xl border border-line/70 bg-background/55 p-4 shadow-soft sm:p-5">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-foreground">Lead list</h2>
            <p className="text-sm text-muted-foreground">
              Use search and filters to narrow the workspace.
            </p>
          </div>
          <div className="mt-4">
            <LeadsToolbar
              q={draftSearch}
              onQChange={setDraftSearch}
              status={query.status}
              onStatusChange={(value) => updateUrl({ status: value }, true)}
              sort={query.sort}
              onSortChange={(value) => updateUrl({ sort: value }, true)}
              order={query.order}
              onOrderChange={(value) => updateUrl({ order: value }, true)}
              onSubmitSearch={(value) => updateUrl({ q: value.trim() }, true)}
              onClearFilters={clearFilters}
              disabled={loading}
            />
          </div>
        </div>

        <div className="rounded-xl border border-line/70 bg-surface/90 shadow-soft">
          <div className="space-y-5 p-4 sm:p-5">
            {loading ? (
              <LeadsLoadingState />
            ) : error ? (
              <LeadsErrorState
                title="Could not load leads"
                description={error}
                onAction={() => setRefreshToken((value) => value + 1)}
              />
            ) : data?.data.length ? (
              <LeadsList leads={data.data} />
            ) : (
              <LeadsEmptyState
                title={emptyState.title}
                description={emptyState.description}
                actionLabel={emptyState.actionLabel}
                onAction={() => {
                  switch (emptyState.action) {
                    case leadsEmptyStateAction.addFirstLead:
                      setCreateOpen(true);
                      break;
                    case leadsEmptyStateAction.goToFirstPage:
                      updateUrl({ page: 1 });
                      break;
                    case leadsEmptyStateAction.clearFilters:
                      clearFilters();
                      break;
                  }
                }}
              />
            )}
          </div>

          {data?.data.length && listMeta.totalPages > 1 ? (
            <LeadsPagination
              page={listMeta.page}
              totalPages={listMeta.totalPages}
              onPageChange={(page) => updateUrl({ page })}
            />
          ) : null}
        </div>
      </section>
    </main>
  );
}
