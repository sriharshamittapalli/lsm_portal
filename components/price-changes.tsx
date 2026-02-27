"use client";

import { useState, useEffect } from "react";
import { Plus, Eye, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PriceChangeFormModal } from "@/components/price-change-form-modal";
import { PriceChangeDetailsModal } from "@/components/price-change-details-modal";
import { getPriceChanges } from "@/lib/store";
import { PriceChange } from "@/lib/types";

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

export function PriceChanges() {
  const [changes, setChanges] = useState<PriceChange[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [detailsChange, setDetailsChange] = useState<PriceChange | null>(null);

  useEffect(() => {
    setChanges(getPriceChanges());
  }, []);

  function handleChangeCreated(change: PriceChange) {
    setChanges((prev) => [...prev, change]);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">
            Price Change Center
          </h2>
          <p className="text-sm text-muted-foreground">
            Submit and track price change requests
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="w-full shrink-0 sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Price Change
        </Button>
      </div>

      {changes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <DollarSign className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold text-muted-foreground">
            No changes yet
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Click &quot;New Price Change&quot; to submit your first price change.
          </p>
          <Button variant="outline" onClick={() => setFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Price Change
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Store Name</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>Updated Price</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {changes.map((change) => (
                <TableRow key={change.id}>
                  <TableCell className="font-medium">{change.id}</TableCell>
                  <TableCell>{Array.isArray(change.storeName) ? change.storeName.join(", ") : change.storeName}</TableCell>
                  <TableCell>${change.currentPrice}</TableCell>
                  <TableCell>${change.updatedPrice}</TableCell>
                  <TableCell>{change.submittedDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusClass(change.status)}
                    >
                      {change.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDetailsChange(change)}
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <PriceChangeFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        onChangeCreated={handleChangeCreated}
      />

      <PriceChangeDetailsModal
        change={detailsChange}
        open={!!detailsChange}
        onOpenChange={(open) => {
          if (!open) setDetailsChange(null);
        }}
      />
    </div>
  );
}
