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
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronsUpDown, X, Search, Plus, Trash2 } from "lucide-react";
import { StoreHoursChange, DayHours, HolidayEntry } from "@/lib/types";
import { saveStoreHoursChange } from "@/lib/store";
import { STORES } from "@/lib/stores";

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
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [storePopoverOpen, setStorePopoverOpen] = useState(false);
  const [storeSearch, setStoreSearch] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [changeType, setChangeType] = useState<"new_hours" | "temporary_close" | "holiday_hours">("new_hours");
  const [hours, setHours] = useState<DayHours[]>(makeDefaultHours);
  const [closeDate, setCloseDate] = useState("");
  const [closeReason, setCloseReason] = useState("");
  const [holidays, setHolidays] = useState<HolidayEntry[]>([{ date: "", name: "" }]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function toggleStore(store: string) {
    setSelectedStores((prev) =>
      prev.includes(store)
        ? prev.filter((s) => s !== store)
        : [...prev, store]
    );
  }

  function removeStore(store: string) {
    setSelectedStores((prev) => prev.filter((s) => s !== store));
  }

  function updateHour(index: number, field: "startTime" | "endTime", value: string) {
    setHours((prev) => prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)));
  }

  function addHoliday() {
    setHolidays((prev) => [...prev, { date: "", name: "" }]);
  }

  function removeHoliday(index: number) {
    setHolidays((prev) => prev.filter((_, i) => i !== index));
  }

  function updateHoliday(index: number, field: "date" | "name", value: string) {
    setHolidays((prev) => prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (selectedStores.length === 0) errs.storeName = "At least one store is required";
    if (!managerName.trim()) errs.managerName = "Manager name is required";
    if (!managerEmail.trim()) errs.managerEmail = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(managerEmail))
      errs.managerEmail = "Invalid email address";

    if (changeType === "new_hours") {
      hours.forEach((h, i) => {
        if (!h.startTime) errs[`start-${i}`] = "Required";
        if (!h.endTime) errs[`end-${i}`] = "Required";
        if (h.startTime && h.endTime && h.endTime <= h.startTime)
          errs[`end-${i}`] = "Must be after start";
      });
    } else if (changeType === "temporary_close") {
      if (!closeDate) errs.closeDate = "Date is required";
      if (!closeReason.trim()) errs.closeReason = "Reason is required";
    } else if (changeType === "holiday_hours") {
      holidays.forEach((h, i) => {
        if (!h.date) errs[`holiday-date-${i}`] = "Date is required";
        if (!h.name.trim()) errs[`holiday-name-${i}`] = "Holiday name is required";
      });
    }

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
      storeName: selectedStores,
      managerName,
      managerEmail,
      changeType,
      hours: changeType === "new_hours" ? hours : [],
      changeDate: changeType === "temporary_close" ? closeDate : undefined,
      changeNote: changeType === "temporary_close" ? closeReason : undefined,
      holidays: changeType === "holiday_hours" ? holidays : undefined,
      submittedDate: new Date().toLocaleDateString("en-US"),
      status: "Pending",
    };

    try {
      const res = await fetch("/api/store-hours-changes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: changeId,
          storeName: selectedStores,
          managerName,
          managerEmail,
          changeType,
          hours: changeType === "new_hours" ? hours : undefined,
          changeDate: changeType === "temporary_close" ? closeDate : undefined,
          changeNote: changeType === "temporary_close" ? closeReason : undefined,
          holidays: changeType === "holiday_hours" ? holidays : undefined,
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
    setSelectedStores([]);
    setStoreSearch("");
    setManagerName("");
    setManagerEmail("");
    setChangeType("new_hours");
    setHours(makeDefaultHours());
    setCloseDate("");
    setCloseReason("");
    setHolidays([{ date: "", name: "" }]);
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
            <Label>
              Store Name <span className="text-destructive">*</span>
            </Label>
            <Popover open={storePopoverOpen} onOpenChange={setStorePopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={storePopoverOpen}
                  className="w-full justify-between font-normal"
                >
                  {selectedStores.length === 0
                    ? "Select stores..."
                    : `${selectedStores.length} store${selectedStores.length > 1 ? "s" : ""} selected`}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <div className="flex items-center gap-2 border-b px-3 py-2">
                  <Search className="h-4 w-4 shrink-0 opacity-50" />
                  <input
                    className="flex h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    placeholder="Search stores..."
                    value={storeSearch}
                    onChange={(e) => setStoreSearch(e.target.value)}
                  />
                </div>
                <div className="max-h-[300px] overflow-y-auto p-1">
                  {STORES.filter((s) =>
                    s.toLowerCase().includes(storeSearch.toLowerCase())
                  ).map((store) => (
                    <button
                      key={store}
                      type="button"
                      className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                      onClick={() => toggleStore(store)}
                    >
                      <div className={`flex h-4 w-4 items-center justify-center rounded-sm border ${selectedStores.includes(store) ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"}`}>
                        {selectedStores.includes(store) && (
                          <Check className="h-3 w-3" />
                        )}
                      </div>
                      {store}
                    </button>
                  ))}
                  {STORES.filter((s) =>
                    s.toLowerCase().includes(storeSearch.toLowerCase())
                  ).length === 0 && (
                    <p className="py-6 text-center text-sm text-muted-foreground">No store found.</p>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            {selectedStores.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedStores.map((store) => (
                  <Badge key={store} variant="secondary" className="gap-1 pr-1">
                    {store}
                    <button
                      type="button"
                      className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
                      onClick={() => removeStore(store)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            {errors.storeName && (
              <p className="text-sm text-destructive">{errors.storeName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              Change Type <span className="text-destructive">*</span>
            </Label>
            <Select value={changeType} onValueChange={(v) => setChangeType(v as typeof changeType)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new_hours">New Store Hours</SelectItem>
                <SelectItem value="temporary_close">Temporary Close</SelectItem>
                <SelectItem value="holiday_hours">Holiday Hours</SelectItem>
              </SelectContent>
            </Select>
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

          {changeType === "new_hours" && (
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
          )}

          {changeType === "temporary_close" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shc-closeDate">
                  Close Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="shc-closeDate"
                  type="date"
                  value={closeDate}
                  onChange={(e) => setCloseDate(e.target.value)}
                />
                {errors.closeDate && (
                  <p className="text-sm text-destructive">{errors.closeDate}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="shc-closeReason">
                  Reason <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="shc-closeReason"
                  value={closeReason}
                  onChange={(e) => setCloseReason(e.target.value)}
                  placeholder="Reason for temporary closure"
                  rows={3}
                />
                {errors.closeReason && (
                  <p className="text-sm text-destructive">{errors.closeReason}</p>
                )}
              </div>
            </div>
          )}

          {changeType === "holiday_hours" && (
            <div className="space-y-3">
              <Label>
                Holidays <span className="text-destructive">*</span>
              </Label>
              <div className="space-y-3">
                {holidays.map((h, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="flex-1 space-y-1">
                      <Input
                        type="date"
                        value={h.date}
                        onChange={(e) => updateHoliday(i, "date", e.target.value)}
                        placeholder="Date"
                      />
                      {errors[`holiday-date-${i}`] && (
                        <p className="text-xs text-destructive">{errors[`holiday-date-${i}`]}</p>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <Input
                        value={h.name}
                        onChange={(e) => updateHoliday(i, "name", e.target.value)}
                        placeholder="Holiday name"
                      />
                      {errors[`holiday-name-${i}`] && (
                        <p className="text-xs text-destructive">{errors[`holiday-name-${i}`]}</p>
                      )}
                    </div>
                    {holidays.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-0.5 shrink-0"
                        onClick={() => removeHoliday(i)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addHoliday}>
                <Plus className="mr-1 h-4 w-4" />
                Add Another Holiday
              </Button>
            </div>
          )}

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
