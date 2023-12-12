import * as mongoose from 'mongoose';

export const BucketObjectSchema = new mongoose.Schema(
  {
    bucketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'S3',
      required: true,
    },
    key: { type: String, required: true, unique: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true, versionKey: false },
);

// Create a composite unique index for bucketId and key
BucketObjectSchema.index({ bucketId: 1, key: 1 }, { unique: true });
