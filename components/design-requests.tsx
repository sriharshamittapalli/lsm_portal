"use client";

import { useState, useEffect } from "react";
import { Plus, Eye, ClipboardList, FileText } from "lucide-react";
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
import { RequestFormModal } from "@/components/request-form-modal";
import { RequestDetailsModal } from "@/components/request-details-modal";
import { JotFormModal } from "@/components/jotform-modal";
import { LsmRequestFormModal } from "@/components/lsm-request-form-modal";
import { getRequests } from "@/lib/store";
import { DesignRequest } from "@/lib/types";

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

export function DesignRequests() {
  const [requests, setRequests] = useState<DesignRequest[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [jotFormOpen, setJotFormOpen] = useState(false);
  const [lsmFormOpen, setLsmFormOpen] = useState(false);
  const [detailsRequest, setDetailsRequest] = useState<DesignRequest | null>(
    null
  );

  useEffect(() => {
    setRequests(getRequests());
  }, []);

  function handleRequestCreated(request: DesignRequest) {
    setRequests((prev) => [...prev, request]);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">
            Design Request Center
          </h2>
          <p className="text-sm text-muted-foreground">
            Submit and track your marketing design requests
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button variant="outline" onClick={() => setJotFormOpen(true)} className="w-full shrink-0 sm:w-auto">
            <ClipboardList className="mr-2 h-4 w-4" />
            Evergreen Order Form
          </Button>
          <Button variant="outline" onClick={() => setLsmFormOpen(true)} className="w-full shrink-0 sm:w-auto">
            <FileText className="mr-2 h-4 w-4" />
            Custom Design Request
          </Button>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold text-muted-foreground">
            No requests yet
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Click &quot;New Request&quot; to submit your first design request.
          </p>
          <Button variant="outline" onClick={() => setFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.id}</TableCell>
                  <TableCell>{req.requestType}</TableCell>
                  <TableCell>{req.submittedDate}</TableCell>
                  <TableCell>{req.eta}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusClass(req.status)}
                    >
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDetailsRequest(req)}
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

      <RequestFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        onRequestCreated={handleRequestCreated}
      />

      <RequestDetailsModal
        request={detailsRequest}
        open={!!detailsRequest}
        onOpenChange={(open) => {
          if (!open) setDetailsRequest(null);
        }}
      />

      <JotFormModal open={jotFormOpen} onOpenChange={setJotFormOpen} />

      <LsmRequestFormModal open={lsmFormOpen} onOpenChange={setLsmFormOpen} />
    </div>
  );
}
