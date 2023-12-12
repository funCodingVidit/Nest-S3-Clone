export interface QueryDto {
  pageNumber: string | number;
  limit: string | number;
}

export interface ParamDto {
  bucketId: string;
  key?: string;
}
