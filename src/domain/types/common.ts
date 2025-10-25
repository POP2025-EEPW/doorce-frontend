export type ID = string;
export type ISODateString = string; // e.g., "2025-02-13T12:00:00Z"
export type NonEmptyString = string;

export type Maybe<T> = T | null | undefined;

export interface PageRequest {
  page?: number; // 1-based
  pageSize?: number; // e.g., 20
}

export interface Page<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiError {
  code: NonEmptyString;
  message: string;
  details?: unknown;
}

export type SortDirection = "asc" | "desc";

export interface Sort {
  field: string;
  dir: SortDirection;
}
