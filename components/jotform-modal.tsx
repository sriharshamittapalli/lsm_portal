"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface JotFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JotFormModal({ open, onOpenChange }: JotFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[95vh] w-[95vw] max-w-none flex-col p-0 sm:max-w-none">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Marketing Assets Form</DialogTitle>
        </DialogHeader>
        <iframe
          src={process.env.NEXT_PUBLIC_JOTFORM_URL}
          className="flex-1 w-full border-0"
          allow="fullscreen"
          title="Marketing Assets Form"
        />
      </DialogContent>
    </Dialog>
  );
}
