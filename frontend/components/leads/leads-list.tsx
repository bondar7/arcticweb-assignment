'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Lead } from '@/lib/types/leads';

import {
  formatLeadDate,
  formatLeadValue,
  getLeadStatusClassName,
  leadStatusLabels,
} from './lead-utils';

type LeadsListProps = {
  leads: Lead[];
};

function leadHref(id: string) {
  return `/leads/${encodeURIComponent(id)}`;
}

function LeadStatusBadge({ status }: { status: Lead['status'] }) {
  return (
    <Badge className={getLeadStatusClassName(status)}>
      {leadStatusLabels[status]}
    </Badge>
  );
}

function LeadActionButton({ id }: { id: string }) {
  return (
    <Button asChild variant="outline" size="sm">
      <Link href={leadHref(id)}>View</Link>
    </Button>
  );
}

function LeadMobileMetaItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid gap-0.5">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium leading-6 text-foreground wrap-break-word">
        {value}
      </dd>
    </div>
  );
}

function LeadMobileCard({ lead }: { lead: Lead }) {
  return (
    <Link
      href={leadHref(lead.id)}
      className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={`Open lead ${lead.name}`}
    >
      <Card className="border-line/70 bg-surface/90 shadow-soft transition-colors group-hover:border-line group-hover:bg-background/80">
        <CardContent className="space-y-4 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <h3 className="text-xl font-semibold leading-tight text-foreground wrap-break-word">
                {lead.name}
              </h3>
              {lead.email ? (
                <p className="text-sm text-muted-foreground break-all">
                  {lead.email}
                </p>
              ) : null}
            </div>
            <LeadStatusBadge status={lead.status} />
          </div>

          <dl className="grid gap-3">
            <LeadMobileMetaItem label="Company" value={lead.company ?? '—'} />
            <LeadMobileMetaItem
              label="Value"
              value={formatLeadValue(lead.value)}
            />
            <LeadMobileMetaItem
              label="Updated"
              value={formatLeadDate(lead.updatedAt)}
            />
          </dl>

          <div className="flex items-center justify-between border-t border-line/60 pt-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Open lead
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
              View
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function LeadsList({ leads }: LeadsListProps) {
  return (
    <>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-24 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium text-foreground">
                  <div className="flex flex-col gap-1">
                    <span>{lead.name}</span>
                    {lead.email ? (
                      <span className="text-xs text-muted-foreground">
                        {lead.email}
                      </span>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>{lead.company ?? '—'}</TableCell>
                <TableCell>
                  <LeadStatusBadge status={lead.status} />
                </TableCell>
                <TableCell>{formatLeadValue(lead.value)}</TableCell>
                <TableCell>{formatLeadDate(lead.updatedAt)}</TableCell>
                <TableCell className="text-right">
                  <LeadActionButton id={lead.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 md:hidden">
        {leads.map((lead) => (
          <LeadMobileCard key={lead.id} lead={lead} />
        ))}
      </div>
    </>
  );
}
