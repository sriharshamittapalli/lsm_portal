"use client";

import { useState, useEffect } from "react";
import { Plus, Eye, Clock } from "lucide-react";
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
import { StoreHoursFormModal } from "@/components/store-hours-form-modal";
import { StoreHoursDetailsModal } from "@/components/store-hours-details-modal";
import { getStoreHoursChanges } from "@/lib/store";
import { StoreHoursChange } from "@/lib/types";

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

export function StoreHoursChanges() {
  const [changes, setChanges] = useState<StoreHoursChange[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [detailsChange, setDetailsChange] = useState<StoreHoursChange | null>(null);

  useEffect(() => {
    setChanges(getStoreHoursChanges());
  }, []);

  function handleChangeCreated(change: StoreHoursChange) {
    setChanges((prev) => [...prev, change]);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">
            Store Hours Change Center
          </h2>
          <p className="text-sm text-muted-foreground">
            Submit and track store hours change requests
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="w-full shrink-0 sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Hours Change
        </Button>
      </div>

      {changes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <Clock className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold text-muted-foreground">
            No changes yet
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Click &quot;New Hours Change&quot; to submit your first store hours change.
          </p>
          <Button variant="outline" onClick={() => setFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Hours Change
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Store Name</TableHead>
                <TableHead>Change Type</TableHead>
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
                  <TableCell>
                    {change.changeType === "temporary_close"
                      ? "Temporary Close"
                      : change.changeType === "holiday_hours"
                        ? "Holiday Hours"
                        : "New Store Hours"}
                  </TableCell>
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

      <StoreHoursFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        onChangeCreated={handleChangeCreated}
      />

      <StoreHoursDetailsModal
        change={detailsChange}
        open={!!detailsChange}
        onOpenChange={(open) => {
          if (!open) setDetailsChange(null);
        }}
      />
    </div>
  );
}
