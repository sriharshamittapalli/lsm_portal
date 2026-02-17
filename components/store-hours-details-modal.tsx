"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StoreHoursChange } from "@/lib/types";

interface StoreHoursDetailsModalProps {
  change: StoreHoursChange | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function statusClass(status: StoreHoursChange["status"]) {
  switch (status) {
    case "Pending":
      return "border-[var(--status-pending)] bg-[var(--status-pending-bg)] text-[var(--status-pending-text)]";
    case "In Progress":
      return "border-[var(--status-in-progress)] bg-[var(--status-in-progress-bg)] text-[var(--status-in-progress-text)]";
    case "Completed":
      return "border-[var(--status-completed)] bg-[var(--status-completed-bg)] text-[var(--status-completed-text)]";
  }
}

function statusVariant(status: StoreHoursChange["status"]) {
  switch (status) {
    case "Pending":
      return "outline" as const;
    case "In Progress":
      return "secondary" as const;
    case "Completed":
      return "default" as const;
  }
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-2">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="col-span-2 text-sm">{value || "—"}</span>
    </div>
  );
}

export function StoreHoursDetailsModal({
  change,
  open,
  onOpenChange,
}: StoreHoursDetailsModalProps) {
  if (!change) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Hours Change {change.id}
            <Badge
              variant={statusVariant(change.status)}
              className={statusClass(change.status)}
            >
              {change.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="space-y-0 divide-y">
          <DetailRow label="Store Name" value={change.storeName} />
          <DetailRow label="Manager" value={change.managerName} />
          <DetailRow label="Email" value={change.managerEmail} />
          <DetailRow label="Submitted" value={change.submittedDate} />
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Weekly Hours</h4>
          <div className="rounded-lg border">
            <div className="grid grid-cols-3 gap-2 border-b bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground">
              <span>Day</span>
              <span>Start Time</span>
              <span>End Time</span>
            </div>
            {(change.hours ?? [{ day: (change as any).day, startTime: (change as any).startTime, endTime: (change as any).endTime }]).map((h) => (
              <div
                key={h.day}
                className="grid grid-cols-3 gap-2 border-b px-3 py-1.5 last:border-b-0"
              >
                <span className="text-sm font-medium">{h.day}</span>
                <span className="text-sm">{h.startTime}</span>
                <span className="text-sm">{h.endTime}</span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
