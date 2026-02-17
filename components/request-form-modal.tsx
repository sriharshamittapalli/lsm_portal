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
import { DesignRequest } from "@/lib/types";
import { saveRequest } from "@/lib/store";

interface RequestFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestCreated: (request: DesignRequest) => void;
}

const REQUEST_TYPES = [
  "Flyer",
  "Banner",
  "Social Media Post",
  "Menu Board",
  "Window Cling",
  "Other",
];

function generateId() {
  return "REQ-" + String(Date.now()).slice(-6);
}

export function RequestFormModal({
  open,
  onOpenChange,
  onRequestCreated,
}: RequestFormModalProps) {
  const [storeNumber, setStoreNumber] = useState("1234");
  const [storeName, setStoreName] = useState("Yogurtland - Downtown LA");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [requestType, setRequestType] = useState("");
  const [description, setDescription] = useState("");
  const [neededByDate, setNeededByDate] = useState("");
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!contactName.trim()) errs.contactName = "Contact name is required";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Invalid email address";
    if (!requestType) errs.requestType = "Request type is required";
    if (!description.trim()) errs.description = "Description is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const today = new Date();
    const submittedDate = today.toLocaleDateString("en-US");

    let eta: string;
    if (neededByDate) {
      eta = new Date(neededByDate).toLocaleDateString("en-US");
    } else {
      const etaDate = new Date(today);
      etaDate.setDate(etaDate.getDate() + 7);
      eta = etaDate.toLocaleDateString("en-US");
    }

    const request: DesignRequest = {
      id: generateId(),
      storeNumber,
      storeName,
      contactName,
      email,
      phone,
      requestType,
      description,
      neededByDate: neededByDate
        ? new Date(neededByDate).toLocaleDateString("en-US")
        : "",
      fileName,
      status: "Pending",
      submittedDate,
      eta,
    };

    saveRequest(request);
    onRequestCreated(request);
    resetForm();
    onOpenChange(false);
  }

  function resetForm() {
    setContactName("");
    setEmail("");
    setPhone("");
    setRequestType("");
    setDescription("");
    setNeededByDate("");
    setFileName("");
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
          <DialogTitle>New Design Request</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storeNumber">Store Number</Label>
              <Input
                id="storeNumber"
                value={storeNumber}
                onChange={(e) => setStoreNumber(e.target.value)}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                readOnly
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactName">
              Contact Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contactName"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Your full name"
            />
            {errors.contactName && (
              <p className="text-sm text-destructive">{errors.contactName}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requestType">
              Request Type <span className="text-destructive">*</span>
            </Label>
            <Select value={requestType} onValueChange={setRequestType}>
              <SelectTrigger id="requestType">
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
            {errors.requestType && (
              <p className="text-sm text-destructive">{errors.requestType}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you need designed..."
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="neededBy">Needed By Date</Label>
              <Input
                id="neededBy"
                type="date"
                value={neededByDate}
                onChange={(e) => setNeededByDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">File Upload (optional)</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) =>
                  setFileName(e.target.files?.[0]?.name ?? "")
                }
              />
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
            <Button type="submit">Submit Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
