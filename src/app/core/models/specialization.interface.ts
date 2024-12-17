export interface specialization {
  id?: number ;
  name: string;
  description: string;
  prerequisites: string[];
  createdAt: string;
  traineeCount?: number;
}


export interface ContentItem {
  id: number;
  name: string;
  description: string;
  prerequisites: string[];
  createdAt: string;
  traineesCount?: number;
}

interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

interface Sort {
  unsorted: boolean;
  sorted: boolean;
  empty: boolean;
}

export interface ContentResponse <T>{
  content: T;
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: Pageable;
  size: number;
  sort: Sort;
  totalElements: number;
  totalPages: number;
}

export interface ActionEvent {
  event: Event;
  action: string;
  spec: specialization;
}
