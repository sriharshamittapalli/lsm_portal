export interface DesignRequest {
  id: string;
  storeNumber: string;
  storeName: string;
  contactName: string;
  email: string;
  phone: string;
  requestType: string;
  description: string;
  neededByDate: string;
  fileName: string;
  status: "Pending" | "In Progress" | "Completed";
  submittedDate: string;
  eta: string;
}

export interface DayHours {
  day: string;
  startTime: string;
  endTime: string;
}

export interface HolidayEntry {
  date: string;
  name: string;
  startTime: string;
  endTime: string;
}

export interface StoreHoursChange {
  id: string;
  storeName: string | string[];
  managerName: string;
  managerEmail: string;
  changeType?: "new_hours" | "temporary_close" | "holiday_hours";
  hours: DayHours[];
  changeDate?: string;
  changeNote?: string;
  holidays?: HolidayEntry[];
  submittedDate: string;
  status: "Pending" | "In Progress" | "Completed";
}

export interface PriceChange {
  id: string;
  storeName: string | string[];
  managerName: string;
  managerEmail: string;
  priceChangeRequest: string;
  effectiveDate: string;
  popNeeded: string;
  description: string;
  currentPrice: string;
  updatedPrice: string;
  submittedDate: string;
  status: "Pending" | "In Progress" | "Completed";
}

export interface LsmRequest {
  id: string;
  requestDate: string;
  storeLocation: string | string[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  lsmTypes: string[];
  desiredMessage: string;
  couponOffers: string;
  couponExpirationDate: string;
  specialInstructions: string;
  sizeWidth: string;
  sizeHeight: string;
  color: string[];
  fileType: string[];
  quantity: string;
  fileSpecialInstructions: string;
  desired1stRoundDate: string;
  artDueDate: string;
  publicationStartDate: string;
  additionalInstructions: string;
  status: "Pending" | "In Progress" | "Completed";
  submittedDate: string;
}
