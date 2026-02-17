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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PriceChange } from "@/lib/types";
import { savePriceChange } from "@/lib/store";

const REQUEST_TYPES = ["InStore", "Online", "NCR", "Others"];

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
  const [storeName, setStoreName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [priceChangeRequest, setPriceChangeRequest] = useState("");
  const [description, setDescription] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [updatedPrice, setUpdatedPrice] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const errs: Record<string, string> = {};
    if (!storeName.trim()) errs.storeName = "Store name is required";
    if (!managerName.trim()) errs.managerName = "Manager name is required";
    if (!managerEmail.trim()) errs.managerEmail = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(managerEmail))
      errs.managerEmail = "Invalid email address";
    if (!priceChangeRequest) errs.priceChangeRequest = "Request type is required";
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
      storeName,
      managerName,
      managerEmail,
      priceChangeRequest,
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
          storeName,
          managerName,
          managerEmail,
          priceChangeRequest,
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
    setStoreName("");
    setManagerName("");
    setManagerEmail("");
    setPriceChangeRequest("");
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
            <Label htmlFor="pc-storeName">
              Store Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="pc-storeName"
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
