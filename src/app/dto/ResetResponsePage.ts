export interface RestResponsePage<T> {
  content: T[];
  pageable?: any;
  totalPages: number;
  totalElements: number;
  size?: number;
  number?: number;
}