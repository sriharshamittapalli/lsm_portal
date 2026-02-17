"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StoreHoursChange } from "@/lib/types";
import { saveStoreHoursChange } from "@/lib/store";

interface StoreHoursFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChangeCreated: (change: StoreHoursChange) => void;
}

function generateId() {
  return "SHC-" + String(Date.now()).slice(-6);
}

export function StoreHoursFormModal({
  open,
  onOpenChange,
  onChangeCreated,
}: StoreHoursFormModalProps) {
  const [storeName, setStoreName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const errs: Record<string, string> = {};
    if (!storeName.trim()) errs.storeName = "Store name is required";
    if (!managerName.trim()) errs.managerName = "Manager name is required";
    if (!managerEmail.trim()) errs.managerEmail = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(managerEmail))
      errs.managerEmail = "Invalid email address";
    if (!startTime) errs.startTime = "Start time is required";
    if (!endTime) errs.endTime = "End time is required";
    if (startTime && endTime && endTime <= startTime)
      errs.endTime = "End time must be after start time";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const changeId = generateId();

    const change: StoreHoursChange = {
      id: changeId,
      storeName,
      managerName,
      managerEmail,
      startTime,
      endTime,
      submittedDate: new Date().toLocaleDateString("en-US"),
      status: "Pending",
    };

    try {
      const res = await fetch("/api/store-hours-changes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: changeId,
          storeName,
          managerName,
          managerEmail,
          startTime,
          endTime,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to submit. Please try again.");
        setSubmitting(false);
        return;
      }
    } catch {
      alert("Network error. Please check your connection and try again.");
      setSubmitting(false);
      return;
    }

    saveStoreHoursChange(change);
    onChangeCreated(change);
    resetForm();
    onOpenChange(false);
    setSubmitting(false);
  }

  function resetForm() {
    setStoreName("");
    setManagerName("");
    setManagerEmail("");
    setStartTime("");
    setEndTime("");
    setErrors({});
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) resetForm();
        onOpenChange(val);
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Store Hours Change</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shc-storeName">
              Store Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="shc-storeName"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="e.g. Yogurtland - Downtown LA"
            />
            {errors.storeName && (
              <p className="text-sm text-destructive">{errors.storeName}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shc-managerName">
                Manager Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="shc-managerName"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                placeholder="Full name"
              />
              {errors.managerName && (
                <p className="text-sm text-destructive">{errors.managerName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="shc-managerEmail">
                Manager Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="shc-managerEmail"
                type="email"
                value={managerEmail}
                onChange={(e) => setManagerEmail(e.target.value)}
                placeholder="manager@example.com"
              />
              {errors.managerEmail && (
                <p className="text-sm text-destructive">{errors.managerEmail}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shc-startTime">
                Start Time <span className="text-destructive">*</span>
              </Label>
              <Input
                id="shc-startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              {errors.startTime && (
                <p className="text-sm text-destructive">{errors.startTime}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="shc-endTime">
                End Time <span className="text-destructive">*</span>
              </Label>
              <Input
                id="shc-endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
              {errors.endTime && (
                <p className="text-sm text-destructive">{errors.endTime}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Change"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
