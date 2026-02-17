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
import { StoreHoursChange, DayHours } from "@/lib/types";
import { saveStoreHoursChange } from "@/lib/store";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DEFAULT_START = "12:00";
const DEFAULT_END = "20:30";

function makeDefaultHours(): DayHours[] {
  return DAYS.map((day) => ({ day, startTime: DEFAULT_START, endTime: DEFAULT_END }));
}

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
  const [hours, setHours] = useState<DayHours[]>(makeDefaultHours);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function updateHour(index: number, field: "startTime" | "endTime", value: string) {
    setHours((prev) => prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!storeName.trim()) errs.storeName = "Store name is required";
    if (!managerName.trim()) errs.managerName = "Manager name is required";
    if (!managerEmail.trim()) errs.managerEmail = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(managerEmail))
      errs.managerEmail = "Invalid email address";

    hours.forEach((h, i) => {
      if (!h.startTime) errs[`start-${i}`] = "Required";
      if (!h.endTime) errs[`end-${i}`] = "Required";
      if (h.startTime && h.endTime && h.endTime <= h.startTime)
        errs[`end-${i}`] = "Must be after start";
    });

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
      hours,
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
          hours,
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
    setHours(makeDefaultHours());
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
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
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

          <div className="space-y-2">
            <Label>
              Weekly Hours <span className="text-destructive">*</span>
            </Label>
            <div className="rounded-lg border">
              <div className="grid grid-cols-[120px_1fr_1fr] gap-2 border-b bg-muted/50 px-3 py-2 text-sm font-medium text-muted-foreground">
                <span>Day</span>
                <span>Start Time</span>
                <span>End Time</span>
              </div>
              {hours.map((h, i) => (
                <div
                  key={h.day}
                  className="grid grid-cols-[120px_1fr_1fr] items-center gap-2 border-b px-3 py-2 last:border-b-0"
                >
                  <span className="text-sm font-medium">{h.day}</span>
                  <div>
                    <Input
                      type="time"
                      value={h.startTime}
                      onChange={(e) => updateHour(i, "startTime", e.target.value)}
                      className="h-8"
                    />
                    {errors[`start-${i}`] && (
                      <p className="text-xs text-destructive">{errors[`start-${i}`]}</p>
                    )}
                  </div>
                  <div>
                    <Input
                      type="time"
                      value={h.endTime}
                      onChange={(e) => updateHour(i, "endTime", e.target.value)}
                      className="h-8"
                    />
                    {errors[`end-${i}`] && (
                      <p className="text-xs text-destructive">{errors[`end-${i}`]}</p>
                    )}
                  </div>
                </div>
              ))}
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
