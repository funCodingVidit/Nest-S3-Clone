import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';
import { DatabaseModule } from 'src/database/database.module';
import { S3Providers } from './schema/s3.provider';
import { BucketObjectProviders } from './schema/bucket_object.provider';

@Module({
  imports: [DatabaseModule],
  providers: [S3Service, ...S3Providers, ...BucketObjectProviders],
  controllers: [S3Controller],
})
export class S3Module {}
