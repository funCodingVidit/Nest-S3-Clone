import { Document } from 'mongoose';

export interface S3 extends Document {
  readonly bucketName: string;
  readonly isPublic: boolean;
}
