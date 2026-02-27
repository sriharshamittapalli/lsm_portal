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
import { Check, ChevronsUpDown, X, Search } from "lucide-react";
import { PriceChange } from "@/lib/types";
import { savePriceChange } from "@/lib/store";
import { STORES } from "@/lib/stores";

const REQUEST_TYPES = ["In-Store", "Online", "NCR", "Others"];

const POP_OPTIONS = [
  "Price Decal",
  "Digital Price Board",
  "Both Price Decal and Digital Price Board",
];

interface PriceChangeFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChangeCreated: (change: PriceChange) => void;
}

function generateId() {
  return "PC-" + String(Date.now()).slice(-6);
}

export function PriceChangeFormModal({
  open,
  onOpenChange,
  onChangeCreated,
}: PriceChangeFormModalProps) {
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [storePopoverOpen, setStorePopoverOpen] = useState(false);
  const [storeSearch, setStoreSearch] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [priceChangeRequest, setPriceChangeRequest] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [popNeeded, setPopNeeded] = useState("");
  const [description, setDescription] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [updatedPrice, setUpdatedPrice] = useState("");
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

  function validate() {
    const errs: Record<string, string> = {};
    if (selectedStores.length === 0) errs.storeName = "At least one store is required";
    if (!managerName.trim()) errs.managerName = "Manager name is required";
    if (!managerEmail.trim()) errs.managerEmail = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(managerEmail))
      errs.managerEmail = "Invalid email address";
    if (!priceChangeRequest) errs.priceChangeRequest = "Request type is required";
    if (!effectiveDate) errs.effectiveDate = "Effective date is required";
    if (!popNeeded) errs.popNeeded = "POP selection is required";
    if (!description.trim()) errs.description = "Description is required";
    if (!currentPrice) errs.currentPrice = "Current price is required";
    else if (parseFloat(currentPrice) <= 0)
      errs.currentPrice = "Price must be a positive number";
    if (!updatedPrice) errs.updatedPrice = "Updated price is required";
    else if (parseFloat(updatedPrice) <= 0)
      errs.updatedPrice = "Price must be a positive number";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const changeId = generateId();

    const change: PriceChange = {
      id: changeId,
      storeName: selectedStores,
      managerName,
      managerEmail,
      priceChangeRequest,
      effectiveDate,
      popNeeded,
      description,
      currentPrice,
      updatedPrice,
      submittedDate: new Date().toLocaleDateString("en-US"),
      status: "Pending",
    };

    try {
      const res = await fetch("/api/price-changes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: changeId,
          storeName: selectedStores,
          managerName,
          managerEmail,
          priceChangeRequest,
          effectiveDate,
          popNeeded,
          description,
          currentPrice,
          updatedPrice,
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

    savePriceChange(change);
    onChangeCreated(change);
    resetForm();
    onOpenChange(false);
    setSubmitting(false);
  }

  function resetForm() {
    setSelectedStores([]);
    setStorePopoverOpen(false);
    setStoreSearch("");
    setManagerName("");
    setManagerEmail("");
    setPriceChangeRequest("");
    setEffectiveDate("");
    setPopNeeded("");
    setDescription("");
    setCurrentPrice("");
    setUpdatedPrice("");
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
          <DialogTitle>New Price Change</DialogTitle>
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
            <Label htmlFor="pc-effectiveDate">
              Effective Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="pc-effectiveDate"
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
            />
            {errors.effectiveDate && (
              <p className="text-sm text-destructive">{errors.effectiveDate}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pc-managerName">
                Manager Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="pc-managerName"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                placeholder="Full name"
              />
              {errors.managerName && (
                <p className="text-sm text-destructive">{errors.managerName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="pc-managerEmail">
                Manager Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="pc-managerEmail"
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
            <Label htmlFor="pc-priceChangeRequest">
              Price Change Request <span className="text-destructive">*</span>
            </Label>
            <Select value={priceChangeRequest} onValueChange={setPriceChangeRequest}>
              <SelectTrigger id="pc-priceChangeRequest">
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent>
                {REQUEST_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.priceChangeRequest && (
              <p className="text-sm text-destructive">{errors.priceChangeRequest}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pc-popNeeded">
              POP Needed <span className="text-destructive">*</span>
            </Label>
            <Select value={popNeeded} onValueChange={setPopNeeded}>
              <SelectTrigger id="pc-popNeeded">
                <SelectValue placeholder="Select POP type..." />
              </SelectTrigger>
              <SelectContent>
                {POP_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.popNeeded && (
              <p className="text-sm text-destructive">{errors.popNeeded}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pc-description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="pc-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the price change reason..."
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pc-currentPrice">
                Current Price <span className="text-destructive">*</span>
              </Label>
              <Input
                id="pc-currentPrice"
                type="number"
                step="0.01"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                placeholder="0.00"
              />
              {errors.currentPrice && (
                <p className="text-sm text-destructive">{errors.currentPrice}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="pc-updatedPrice">
                Updated Price <span className="text-destructive">*</span>
              </Label>
              <Input
                id="pc-updatedPrice"
                type="number"
                step="0.01"
                value={updatedPrice}
                onChange={(e) => setUpdatedPrice(e.target.value)}
                placeholder="0.00"
              />
              {errors.updatedPrice && (
                <p className="text-sm text-destructive">{errors.updatedPrice}</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-sm text-amber-900">
              Store price change requests will take up to 24-48 hours from submitted date during regular business hours M-F 8-5pm (CT) excluding holidays. Printed price decals take up to 3-5 days for mailing USPS. All price per ounce changes must be consulted with FBC prior to submission.
            </p>
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
