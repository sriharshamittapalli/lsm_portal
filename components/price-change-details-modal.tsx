"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PriceChange } from "@/lib/types";

interface PriceChangeDetailsModalProps {
  change: PriceChange | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function statusClass(status: PriceChange["status"]) {
  switch (status) {
    case "Pending":
      return "border-[var(--status-pending)] bg-[var(--status-pending-bg)] text-[var(--status-pending-text)]";
    case "In Progress":
      return "border-[var(--status-in-progress)] bg-[var(--status-in-progress-bg)] text-[var(--status-in-progress-text)]";
    case "Completed":
      return "border-[var(--status-completed)] bg-[var(--status-completed-bg)] text-[var(--status-completed-text)]";
  }
}

function statusVariant(status: PriceChange["status"]) {
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

export function PriceChangeDetailsModal({
  change,
  open,
  onOpenChange,
}: PriceChangeDetailsModalProps) {
  if (!change) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Price Change {change.id}
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
          <DetailRow label="Request Type" value={change.priceChangeRequest} />
          <DetailRow label="Description" value={change.description} />
          <DetailRow label="Current Price" value={`$${change.currentPrice}`} />
          <DetailRow label="Updated Price" value={`$${change.updatedPrice}`} />
          <DetailRow label="Submitted" value={change.submittedDate} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
