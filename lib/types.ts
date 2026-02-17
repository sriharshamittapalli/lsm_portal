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

export interface StoreHoursChange {
  id: string;
  storeName: string;
  managerName: string;
  managerEmail: string;
  day: string;
  startTime: string;
  endTime: string;
  submittedDate: string;
  status: "Pending" | "In Progress" | "Completed";
}

export interface PriceChange {
  id: string;
  storeName: string;
  managerName: string;
  managerEmail: string;
  priceChangeRequest: string;
  description: string;
  currentPrice: string;
  updatedPrice: string;
  submittedDate: string;
  status: "Pending" | "In Progress" | "Completed";
}
