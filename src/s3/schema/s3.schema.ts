import * as mongoose from 'mongoose';

export const S3Schema = new mongoose.Schema(
  {
    bucketName: { type: String, required: true, unique: true },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false },
);
