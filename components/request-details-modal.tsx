"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DesignRequest } from "@/lib/types";

interface RequestDetailsModalProps {
  request: DesignRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function statusVariant(status: DesignRequest["status"]) {
  switch (status) {
    case "Pending":
      return "outline" as const;
    case "In Progress":
      return "secondary" as const;
    case "Completed":
      return "default" as const;
  }
}

function statusClass(status: DesignRequest["status"]) {
  switch (status) {
    case "Pending":
      return "border-[var(--status-pending)] bg-[var(--status-pending-bg)] text-[var(--status-pending-text)]";
    case "In Progress":
      return "border-[var(--status-in-progress)] bg-[var(--status-in-progress-bg)] text-[var(--status-in-progress-text)]";
    case "Completed":
      return "border-[var(--status-completed)] bg-[var(--status-completed-bg)] text-[var(--status-completed-text)]";
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

export function RequestDetailsModal({
  request,
  open,
  onOpenChange,
}: RequestDetailsModalProps) {
  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Request {request.id}
            <Badge
              variant={statusVariant(request.status)}
              className={statusClass(request.status)}
            >
              {request.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="space-y-0 divide-y">
          <DetailRow label="Request Type" value={request.requestType} />
          <DetailRow label="Store" value={`${request.storeName} (#${request.storeNumber})`} />
          <DetailRow label="Contact" value={request.contactName} />
          <DetailRow label="Email" value={request.email} />
          <DetailRow label="Phone" value={request.phone} />
          <DetailRow label="Description" value={request.description} />
          <DetailRow label="Needed By" value={request.neededByDate} />
          <DetailRow label="Submitted" value={request.submittedDate} />
          <DetailRow label="ETA" value={request.eta} />
          <DetailRow label="Attachment" value={request.fileName} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
