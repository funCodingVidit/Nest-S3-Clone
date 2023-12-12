import { Document } from 'mongoose';

export interface S3Object extends Document {
  bucketId: string;
  key: string;
  data: Buffer;
}
