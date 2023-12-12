export interface CreateObjectDto {
  bucketId: string;
  key: string;
  data: Buffer;
}
