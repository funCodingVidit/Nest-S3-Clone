import { Mongoose } from 'mongoose';
import { S3Schema } from './s3.schema';

export const S3Providers = [
  {
    provide: 'S3_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('S3', S3Schema),
    inject: ['DATABASE_CONNECTION'],
  },
];
