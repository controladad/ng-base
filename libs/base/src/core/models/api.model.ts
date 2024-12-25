// APIs Generic & Base properties

export type StatusType = 'Active' | 'Inactive';
export type GenderType = 'male' | 'female';

export interface APIPagination {
  page: number;
  amountOfListPerPage: number;
  total: number;
  pageCount: number;
}
export interface APIPaginatedData<T> {
  data: T[];
  pagination: APIPagination;
}
export interface APIData<T> {
  data: T[];
}

export interface APIError {
  message: string;
  code: number;
}
