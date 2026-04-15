import { InfraDialog } from '@/components/infra-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

const palette = [
  { label: 'Background', value: '#f5f7f2' },
  { label: 'Surface', value: '#ffffff' },
  { label: 'Ink', value: '#111418' },
  { label: 'Muted', value: '#5e6875' },
  { label: 'Line', value: '#d8dee6' },
  { label: 'Brand', value: '#b6ff2e' },
  { label: 'Cyan', value: '#00c2ff' },
] as const;

const rows = [
  {
    name: 'Lead capture',
    status: 'Ready',
    notes: 'Clear fields, calm spacing, consistent controls',
  },
  {
    name: 'Follow-up flow',
    status: 'Pending',
    notes: 'Simple status changes and quick next steps',
  },
  {
    name: 'Workspace data',
    status: 'Pending',
    notes: 'PostgreSQL-backed records through the API',
  },
];

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-line/70 bg-surface/85 shadow-soft backdrop-blur-sm">
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="brand">Lead Tracker</Badge>
              <Badge variant="secondary">Mini CRM</Badge>
              <Badge variant="outline">Product shell</Badge>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl">
                Keep the pipeline clear
              </CardTitle>
              <CardDescription className="max-w-2xl text-base leading-7">
                Lead Tracker is set up as a calm, consistent workspace for
                keeping contacts, follow-ups, and notes in one place.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-line/70 bg-background/70 p-4">
              <div className="text-sm font-semibold text-foreground">Focus</div>
              <div className="mt-1 text-sm leading-6 text-muted-foreground">
                A clear path from first contact to next action.
              </div>
            </div>
            <div className="rounded-lg border border-line/70 bg-background/70 p-4">
              <div className="text-sm font-semibold text-foreground">Style</div>
              <div className="mt-1 text-sm leading-6 text-muted-foreground">
                Simple surfaces, soft borders, and reusable controls.
              </div>
            </div>
            <div className="rounded-lg border border-line/70 bg-background/70 p-4">
              <div className="text-sm font-semibold text-foreground">
                Consistency
              </div>
              <div className="mt-1 text-sm leading-6 text-muted-foreground">
                Shared tokens keep the whole workspace aligned.
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-3">
            <Button>Open workspace</Button>
            <Button variant="outline">Review notes</Button>
            <InfraDialog />
          </CardFooter>
        </Card>

        <div className="grid gap-6">
          <Card className="border-line/70 bg-surface/85 shadow-soft backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Workspace palette</CardTitle>
              <CardDescription>
                Central colors that keep the UI steady.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {palette.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {item.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.value}
                    </div>
                  </div>
                  <div
                    aria-hidden="true"
                    className="h-10 w-20 rounded-lg border border-line/70 shadow-sm"
                    style={{ backgroundColor: item.value }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Alert className="border-line/70 bg-cyan-soft/55">
            <AlertTitle>Architecture</AlertTitle>
            <AlertDescription>
              The frontend stays in Next.js while NestJS handles the separate
              backend layer.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <Card className="border-line/70 bg-surface/85 shadow-soft backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Lead details</CardTitle>
            <CardDescription>
              Clean input surfaces for the first workflow.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="lead-name">Contact name</Label>
              <Input id="lead-name" placeholder="Acme Studio" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lead-status">Stage</Label>
              <Select>
                <SelectTrigger id="lead-status">
                  <SelectValue placeholder="Choose a stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">NEW</SelectItem>
                  <SelectItem value="contacted">CONTACTED</SelectItem>
                  <SelectItem value="progress">IN_PROGRESS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lead-notes">Notes</Label>
              <Textarea
                id="lead-notes"
                rows={4}
                placeholder="Short internal note"
              />
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button>Save details</Button>
            <Button variant="outline">Clear fields</Button>
          </CardFooter>
        </Card>

        <Card className="border-line/70 bg-surface/85 shadow-soft backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Pipeline overview</CardTitle>
            <CardDescription>
              A compact view for future lead tracking.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Area</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell className="font-medium text-foreground">
                      {row.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={row.status === 'Ready' ? 'brand' : 'secondary'}
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.notes}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="grid gap-3 rounded-lg border border-dashed border-line/70 bg-background/60 p-4">
              <div className="text-sm font-semibold text-foreground">
                Empty-state rhythm
              </div>
              <div className="grid gap-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
