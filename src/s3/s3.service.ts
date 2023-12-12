import { Inject, Injectable } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import { S3 } from './interface/s3.interface';
import { CreateS3Dto } from './dto/create-s3.dto';
import { ParamDto, QueryDto } from './dto/query.dto';
import { numericConstants } from 'src/constants/numeric';
import { ServiceResponse } from './interface/response.interface';
import { message } from 'src/constants/message';
import { CreateObjectDto } from './dto/create-object.dto';
import { S3Object } from './interface/create-object.interface';
import { statusCodes } from 'src/constants/statusCode';

@Injectable()
export class S3Service {
  constructor(
    @Inject('S3_MODEL') private readonly s3Model: Model<S3>,
    @Inject('BUCKET_OBJECT_MODEL')
    private readonly bucketObjectModel: Model<S3Object>,
  ) {}

  async createBucket(createBucketDto: CreateS3Dto): Promise<ServiceResponse> {
    createBucketDto.bucketName = createBucketDto.bucketName.toLowerCase();
    const { bucketName } = createBucketDto;

    /** Check if bucket already present with this bucket name or not */
    const isBucketAlreadyPresent = await this.s3Model
      .findOne({ bucketName })
      .lean();
    if (isBucketAlreadyPresent) {
      return {
        success: false,
        message: message.BUCKET_ALREADY_PRESENT,
        error: {},
      };
    }

    /** Create new bucket with bucket name*/
    const newlyCreatedBucket = await this.s3Model.create(createBucketDto);
    return {
      success: true,
      message: message.BUCKET_CREATED,
      data: newlyCreatedBucket,
    };
  }

  async getBuckets(queries: QueryDto) {
    let { pageNumber, limit } = queries;
    pageNumber = pageNumber ? Number(pageNumber) : numericConstants.ONE;
    limit = limit ? Number(limit) : numericConstants.TEN;
    const skip = limit * (pageNumber - numericConstants.ONE)
    const listOfBuckets: any = this.s3Model
      .find()
      .skip(skip)
      .limit(limit)
      .lean();
    return listOfBuckets;
  }

  async addNewObject(
    createObjectDto: CreateObjectDto,
  ): Promise<ServiceResponse> {
    const { bucketId, key, data } = createObjectDto;

    if (!isValidObjectId(bucketId)) {
      return {
        success: false,
        message: message.INVALID_BUCKET_ID,
        data: {},
      };
    }

    /** Check if bucket already present with this bucket name or not */
    const isBucketPresent: S3 = await this.s3Model
      .findById({ _id: bucketId })
      .lean();
    if (!isBucketPresent) {
      return {
        success: false,
        message: message.BUCKET_NOT_FOUND,
        error: {},
      };
    }

    /** Check if current key related data already present in db*/
    const isDataAlreadyPresent: S3Object = await this.bucketObjectModel.findOne(
      {
        $and: [{ bucketId }, { key }],
      },
    );

    /** If data already present with respective key then update the existing data else create new one */
    if (isDataAlreadyPresent) {
      isDataAlreadyPresent.data = data;
      isDataAlreadyPresent.save();
    } else {
      this.bucketObjectModel.create({
        bucketId: isBucketPresent._id,
        key,
        data,
      });
    }

    // Create file location based on api point (We can fetch this hostName information from env as well config file based on running environment )
    const location = `localhost:3000/s3/${bucketId}/${key}`;

    return {
      success: true,
      message: message.OBJECT_ADDED,
      data: { location },
    };
  }

  async getAllObjects(
    params: ParamDto,
    queries: QueryDto,
  ): Promise<ServiceResponse> {
    const { bucketId } = params;

    if (!isValidObjectId(bucketId)) {
      return {
        success: false,
        message: message.INVALID_BUCKET_ID,
        data: {},
      };
    }

    let { pageNumber, limit } = queries;
    pageNumber = pageNumber ? Number(pageNumber) : numericConstants.ONE;
    limit = limit ? Number(limit) : numericConstants.TEN;

    /** Check bucket is present or not */
    const isBucketAlreadyPresent: S3 = await this.s3Model
      .findById({ _id: bucketId })
      .lean();
    if (!isBucketAlreadyPresent) {
      return {
        success: false,
        message: message.BUCKET_NOT_FOUND,
        error: {},
      };
    }

    const objectInfo: S3Object[] = await this.bucketObjectModel
      .find({
        bucketId,
      })
      .skip(limit * (pageNumber - numericConstants.ONE))
      .limit(limit)
      .lean();

    /** If object not present then send object not found. */
    if (objectInfo.length === numericConstants.ZERO) {
      return {
        success: false,
        message: message.OBJECTS_NOT_FOUND,
        statusCode: statusCodes.NOT_FOUND,
        data: {},
      };
    }

    return {
      success: true,
      message: message.OBJECT_FETCHED,
      data: objectInfo,
    };
  }

  async getObject(params: ParamDto): Promise<ServiceResponse> {
    const { bucketId, key } = params;

    if (!isValidObjectId(bucketId)) {
      return {
        success: false,
        message: message.INVALID_BUCKET_ID,
        data: {},
      };
    }

    /** Check bucket is present or not */
    const isBucketAlreadyPresent: S3 = await this.s3Model
      .findById({ _id: bucketId })
      .lean();
    if (!isBucketAlreadyPresent) {
      return {
        success: false,
        message: message.BUCKET_NOT_FOUND,
        error: {},
      };
    }

    const objectInfo: S3Object = await this.bucketObjectModel.findOne({
      $and: [{ bucketId }, { key }],
    });

    /** If object not present then send object not found. */
    if (!objectInfo) {
      return {
        success: false,
        message: message.OBJECT_NOT_FOUND,
        statusCode: statusCodes.NOT_FOUND,
        data: {},
      };
    }

    return {
      success: true,
      message: message.OBJECT_FETCHED,
      data: objectInfo.data,
    };
  }

  async deleteObject(params: ParamDto): Promise<ServiceResponse> {
    const { bucketId, key } = params;

    if (!isValidObjectId(bucketId)) {
      return {
        success: false,
        message: message.INVALID_BUCKET_ID,
        data: {},
      };
    }

    /** Check bucket is present or not */
    const isBucketAlreadyPresent: S3 = await this.s3Model
      .findById({ _id: bucketId })
      .lean();
    if (!isBucketAlreadyPresent) {
      return {
        success: false,
        message: message.BUCKET_NOT_FOUND,
        error: {},
      };
    }

    const objectInfo: S3Object = await this.bucketObjectModel.findOne({
      $and: [{ bucketId }, { key }],
    });

    /** If object not present then send object not found. */
    if (!objectInfo) {
      return {
        success: false,
        message: message.OBJECT_NOT_FOUND,
        statusCode: statusCodes.NOT_FOUND,
        data: {},
      };
    }

    /** delete object. */
    await this.bucketObjectModel.findOneAndDelete({
      $and: [{ bucketId }, { key }],
    });

    return {
      success: true,
      message: message.OBJECT_DELETED,
      data: { keyId: objectInfo.key },
    };
  }
}
