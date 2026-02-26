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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { LsmRequest } from "@/lib/types";
import { saveLsmRequest } from "@/lib/store";

interface LsmRequestFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LSM_TYPES = [
  "Print Ad",
  "Web Ad",
  "Poster - 1 sided",
  "Poster - 2 sided",
  "Flyer - 8 1/2 x 11",
  "Direct Mail",
  "Billboard",
  "Banner - Outdoor",
  "Bounce Back Coupon",
  "Counter Card (easel back)",
  "Social Art/Email Art",
  "Other",
];

const COLOR_OPTIONS = ["4-color", "Black & White", "Other"];
const FILE_TYPE_OPTIONS = ["JPG", "PDF", "PNG", "Other"];

function generateId() {
  return "LSM-" + String(Date.now()).slice(-6);
}

export function LsmRequestFormModal({
  open,
  onOpenChange,
}: LsmRequestFormModalProps) {
  const [storeLocation, setStoreLocation] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [lsmTypes, setLsmTypes] = useState<string[]>([]);
  const [desiredMessage, setDesiredMessage] = useState("");
  const [couponOffers, setCouponOffers] = useState("");
  const [couponExpirationDate, setCouponExpirationDate] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [sizeWidth, setSizeWidth] = useState("");
  const [sizeHeight, setSizeHeight] = useState("");
  const [color, setColor] = useState<string[]>([]);
  const [fileType, setFileType] = useState<string[]>([]);
  const [quantity, setQuantity] = useState("");
  const [fileSpecialInstructions, setFileSpecialInstructions] = useState("");
  const [desired1stRoundDate, setDesired1stRoundDate] = useState("");
  const [artDueDate, setArtDueDate] = useState("");
  const [publicationStartDate, setPublicationStartDate] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function toggleCheckbox(
    value: string,
    list: string[],
    setter: (v: string[]) => void
  ) {
    setter(
      list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value]
    );
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!storeLocation.trim()) errs.storeLocation = "Store location is required";
    if (!contactName.trim()) errs.contactName = "Contact name is required";
    if (!contactEmail.trim()) errs.contactEmail = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail))
      errs.contactEmail = "Invalid email address";
    if (lsmTypes.length === 0) errs.lsmTypes = "Select at least one LSM type";
    if (!desiredMessage.trim()) errs.desiredMessage = "Message is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const today = new Date();
    const requestDate = today.toLocaleDateString("en-US");
    const requestId = generateId();

    const request: LsmRequest = {
      id: requestId,
      requestDate,
      storeLocation,
      contactName,
      contactEmail,
      contactPhone,
      lsmTypes,
      desiredMessage,
      couponOffers,
      couponExpirationDate: couponExpirationDate
        ? new Date(couponExpirationDate).toLocaleDateString("en-US")
        : "",
      specialInstructions,
      sizeWidth,
      sizeHeight,
      color,
      fileType,
      quantity,
      fileSpecialInstructions,
      desired1stRoundDate: desired1stRoundDate
        ? new Date(desired1stRoundDate).toLocaleDateString("en-US")
        : "",
      artDueDate: artDueDate
        ? new Date(artDueDate).toLocaleDateString("en-US")
        : "",
      publicationStartDate: publicationStartDate
        ? new Date(publicationStartDate).toLocaleDateString("en-US")
        : "",
      additionalInstructions,
      status: "Pending",
      submittedDate: requestDate,
    };

    try {
      const res = await fetch("/api/lsm-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to submit request. Please try again.");
        setSubmitting(false);
        return;
      }
    } catch {
      alert("Network error. Please check your connection and try again.");
      setSubmitting(false);
      return;
    }

    saveLsmRequest(request);
    resetForm();
    onOpenChange(false);
    setSubmitting(false);
  }

  function resetForm() {
    setStoreLocation("");
    setContactName("");
    setContactEmail("");
    setContactPhone("");
    setLsmTypes([]);
    setDesiredMessage("");
    setCouponOffers("");
    setCouponExpirationDate("");
    setSpecialInstructions("");
    setSizeWidth("");
    setSizeHeight("");
    setColor([]);
    setFileType([]);
    setQuantity("");
    setFileSpecialInstructions("");
    setDesired1stRoundDate("");
    setArtDueDate("");
    setPublicationStartDate("");
    setAdditionalInstructions("");
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
          <DialogTitle>LSM Request Form</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Contact Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lsm-requestDate">Request Date</Label>
                <Input
                  id="lsm-requestDate"
                  value={new Date().toLocaleDateString("en-US")}
                  readOnly
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lsm-storeLocation">
                  Store #/Location <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lsm-storeLocation"
                  value={storeLocation}
                  onChange={(e) => setStoreLocation(e.target.value)}
                  placeholder="e.g. #1234 - Downtown LA"
                />
                {errors.storeLocation && (
                  <p className="text-sm text-destructive">{errors.storeLocation}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lsm-contactName">
                Contact Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lsm-contactName"
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
                <Label htmlFor="lsm-contactEmail">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lsm-contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="you@example.com"
                />
                {errors.contactEmail && (
                  <p className="text-sm text-destructive">{errors.contactEmail}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lsm-contactPhone">Phone</Label>
                <Input
                  id="lsm-contactPhone"
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Type of LSM Request */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Type of LSM Request <span className="text-destructive">*</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {LSM_TYPES.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <Checkbox
                    checked={lsmTypes.includes(type)}
                    onCheckedChange={() =>
                      toggleCheckbox(type, lsmTypes, setLsmTypes)
                    }
                  />
                  {type}
                </label>
              ))}
            </div>
            {errors.lsmTypes && (
              <p className="text-sm text-destructive">{errors.lsmTypes}</p>
            )}
          </div>

          {/* Desired Message */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Message
            </h3>
            <div className="space-y-2">
              <Label htmlFor="lsm-desiredMessage">
                Desired LSM Message(s) <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="lsm-desiredMessage"
                value={desiredMessage}
                onChange={(e) => setDesiredMessage(e.target.value)}
                placeholder="Enter your desired marketing message..."
                rows={3}
              />
              {errors.desiredMessage && (
                <p className="text-sm text-destructive">{errors.desiredMessage}</p>
              )}
            </div>
          </div>

          {/* Coupon Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Coupon Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lsm-couponOffers">Coupon Offer(s)</Label>
                <Input
                  id="lsm-couponOffers"
                  value={couponOffers}
                  onChange={(e) => setCouponOffers(e.target.value)}
                  placeholder="e.g. Buy 1 Get 1 Free"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lsm-couponExpDate">Coupon Expiration Date</Label>
                <Input
                  id="lsm-couponExpDate"
                  type="date"
                  value={couponExpirationDate}
                  onChange={(e) => setCouponExpirationDate(e.target.value)}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Note: If coupon needs a unique code, please submit a separate Portal Request.
            </p>
          </div>

          {/* Special Instructions */}
          <div className="space-y-2">
            <Label htmlFor="lsm-specialInstructions">Special Instructions</Label>
            <Textarea
              id="lsm-specialInstructions"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any special instructions for the design..."
              rows={3}
            />
          </div>

          {/* File Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              File Details
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lsm-sizeWidth">Width</Label>
                <Input
                  id="lsm-sizeWidth"
                  value={sizeWidth}
                  onChange={(e) => setSizeWidth(e.target.value)}
                  placeholder='e.g. 8.5"'
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lsm-sizeHeight">Height</Label>
                <Input
                  id="lsm-sizeHeight"
                  value={sizeHeight}
                  onChange={(e) => setSizeHeight(e.target.value)}
                  placeholder='e.g. 11"'
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lsm-quantity">Quantity</Label>
                <Input
                  id="lsm-quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-4">
                {COLOR_OPTIONS.map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <Checkbox
                      checked={color.includes(opt)}
                      onCheckedChange={() =>
                        toggleCheckbox(opt, color, setColor)
                      }
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>File Type</Label>
              <div className="flex flex-wrap gap-4">
                {FILE_TYPE_OPTIONS.map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <Checkbox
                      checked={fileType.includes(opt)}
                      onCheckedChange={() =>
                        toggleCheckbox(opt, fileType, setFileType)
                      }
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lsm-fileSpecialInstructions">
                Special Instructions for File
              </Label>
              <Textarea
                id="lsm-fileSpecialInstructions"
                value={fileSpecialInstructions}
                onChange={(e) => setFileSpecialInstructions(e.target.value)}
                placeholder="Any special instructions for the file..."
                rows={2}
              />
            </div>
          </div>

          {/* Due Dates */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Due Dates
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lsm-desired1stRound">Desired 1st Round</Label>
                <Input
                  id="lsm-desired1stRound"
                  type="date"
                  value={desired1stRoundDate}
                  onChange={(e) => setDesired1stRoundDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lsm-artDueDate">Art Due Date</Label>
                <Input
                  id="lsm-artDueDate"
                  type="date"
                  value={artDueDate}
                  onChange={(e) => setArtDueDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lsm-pubStartDate">Publication Start</Label>
                <Input
                  id="lsm-pubStartDate"
                  type="date"
                  value={publicationStartDate}
                  onChange={(e) => setPublicationStartDate(e.target.value)}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Note: Please allow 5-7 business days for the design process.
            </p>
          </div>

          {/* Additional Instructions */}
          <div className="space-y-2">
            <Label htmlFor="lsm-additionalInstructions">
              Additional Instructions
            </Label>
            <Textarea
              id="lsm-additionalInstructions"
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              placeholder="Any additional instructions or notes..."
              rows={3}
            />
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
              {submitting ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
