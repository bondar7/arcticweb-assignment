'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function InfraDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Workspace details</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lead Tracker is ready</DialogTitle>
          <DialogDescription>
            The app is set up with a clean UI system and shared design tokens,
            ready for the first lead workflow.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
