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
          <DetailRow label="Store Name" value={Array.isArray(change.storeName) ? change.storeName.join(", ") : change.storeName} />
          <DetailRow
            label="Change Type"
            value={
              change.changeType === "temporary_close"
                ? "Temporary Close"
                : change.changeType === "holiday_hours"
                  ? "Holiday Hours"
                  : "New Store Hours"
            }
          />
          <DetailRow label="Manager" value={change.managerName} />
          <DetailRow label="Email" value={change.managerEmail} />
          <DetailRow label="Submitted" value={change.submittedDate} />
        </div>

        <Separator />

        {(!change.changeType || change.changeType === "new_hours") && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Weekly Hours</h4>
            <div className="rounded-lg border">
              <div className="grid grid-cols-3 gap-2 border-b bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground">
                <span>Day</span>
                <span>Start Time</span>
                <span>End Time</span>
              </div>
              {(change.hours ?? []).map((h) => (
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
        )}

        {change.changeType === "temporary_close" && (
          <div className="space-y-0 divide-y">
            <DetailRow label="Close Date" value={change.changeDate || ""} />
            <DetailRow label="Reason" value={change.changeNote || ""} />
          </div>
        )}

        {change.changeType === "holiday_hours" && change.holidays && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Holidays</h4>
            <div className="rounded-lg border">
              <div className="grid grid-cols-4 gap-2 border-b bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground">
                <span>Date</span>
                <span>Holiday Name</span>
                <span>Start Time</span>
                <span>End Time</span>
              </div>
              {change.holidays.map((h, i) => (
                <div
                  key={i}
                  className="grid grid-cols-4 gap-2 border-b px-3 py-1.5 last:border-b-0"
                >
                  <span className="text-sm">{h.date}</span>
                  <span className="text-sm">{h.name}</span>
                  <span className="text-sm">{h.startTime}</span>
                  <span className="text-sm">{h.endTime}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
