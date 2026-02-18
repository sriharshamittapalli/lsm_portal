import { DesignRequest, StoreHoursChange, PriceChange, LsmRequest } from "./types";

const STORAGE_KEY = "yogurtland_design_requests";

export function getRequests(): DesignRequest[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveRequest(request: DesignRequest): void {
  const requests = getRequests();
  requests.push(request);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

export function getRequestById(id: string): DesignRequest | undefined {
  return getRequests().find((r) => r.id === id);
}

// Store Hours Changes
const STORE_HOURS_KEY = "yogurtland_store_hours_changes";

export function getStoreHoursChanges(): StoreHoursChange[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORE_HOURS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveStoreHoursChange(change: StoreHoursChange): void {
  const changes = getStoreHoursChanges();
  changes.push(change);
  localStorage.setItem(STORE_HOURS_KEY, JSON.stringify(changes));
}

export function getStoreHoursChangeById(id: string): StoreHoursChange | undefined {
  return getStoreHoursChanges().find((c) => c.id === id);
}

// Price Changes
const PRICE_CHANGES_KEY = "yogurtland_price_changes";

export function getPriceChanges(): PriceChange[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(PRICE_CHANGES_KEY);
  return data ? JSON.parse(data) : [];
}

export function savePriceChange(change: PriceChange): void {
  const changes = getPriceChanges();
  changes.push(change);
  localStorage.setItem(PRICE_CHANGES_KEY, JSON.stringify(changes));
}

export function getPriceChangeById(id: string): PriceChange | undefined {
  return getPriceChanges().find((c) => c.id === id);
}

// LSM Requests
const LSM_REQUESTS_KEY = "yogurtland_lsm_requests";

export function getLsmRequests(): LsmRequest[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(LSM_REQUESTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveLsmRequest(request: LsmRequest): void {
  const requests = getLsmRequests();
  requests.push(request);
  localStorage.setItem(LSM_REQUESTS_KEY, JSON.stringify(requests));
}

export function getLsmRequestById(id: string): LsmRequest | undefined {
  return getLsmRequests().find((r) => r.id === id);
}
