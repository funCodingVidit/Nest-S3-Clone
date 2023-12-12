import { S3Service } from './s3.service';
import { CreateS3Dto } from './dto/create-s3.dto';
import { ParamDto, QueryDto } from './dto/query.dto';
import { Response } from 'express';
import { statusCodes } from 'src/constants/statusCode';
import { message } from 'src/constants/message';
import { ValidateRequestPipe } from 'src/pipes/validation.pipe';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UsePipes,
} from '@nestjs/common';
import { createBucketValidationSchema } from 'src/validations/createBucket.validation';
import { addNewObjectValidationSchema } from 'src/validations/addObject.validation';
import { CreateObjectDto } from './dto/create-object.dto';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  /**
   * @param createS3Dto Required parameters to create new bucket.
   * @returns NewlyCreated bucket.
   */
  @Post('bucket')
  @UsePipes(new ValidateRequestPipe(createBucketValidationSchema))
  async create(@Body() createS3Dto: CreateS3Dto, @Res() res: Response) {
    const { success, message, data, error } = await this.s3Service.createBucket(
      createS3Dto,
    );
    return success
      ? res.status(statusCodes.SUCCESS).json({ success, message, data })
      : res.status(statusCodes.BAD_REQUEST).json({ success, message, error });
  }

  /**
   * @param queries Required queries
   * @return List of already present buckets
   */
  @Get('buckets')
  async getBuckets(@Query() queries: QueryDto, @Res() res: Response) {
    const getAlreadyPresentBuckets = await this.s3Service.getBuckets(queries);
    return res.status(statusCodes.SUCCESS).json({
      message: message.ALL_BUCKET_LIST,
      data: getAlreadyPresentBuckets,
    });
  }

  /**
   * @param createObjectDto Contains all basic information to create new object.
   * @returns Newly added object information.
   */
  @Post('newObject')
  @UsePipes(new ValidateRequestPipe(addNewObjectValidationSchema))
  async addNewObject(
    @Body() createObjectDto: CreateObjectDto,
    @Res() res: Response,
  ) {
    const { success, message, data, error } = await this.s3Service.addNewObject(
      createObjectDto,
    );
    return success
      ? res.status(statusCodes.SUCCESS).json({ success, message, data })
      : res.status(statusCodes.BAD_REQUEST).json({ success, message, error });
  }

  /**
   * @param params Params will contains bucketId
   * @param queries Queries will contains limit and pageNumbers.
   * @returns Bucket list with pagination.
   */
  @Get('objects/:bucketId')
  async getAllObjects(
    @Param() params: ParamDto,
    @Query() queries: QueryDto,
    @Res() res: Response,
  ) {
    const { success, message, data, error, statusCode } =
      await this.s3Service.getAllObjects(params, queries);
    return success
      ? res.status(statusCodes.SUCCESS).json({ success, message, data })
      : res
          .status(statusCode ? statusCode : statusCodes.BAD_REQUEST)
          .json({ success, message, error });
  }

  /**
   * @param params Params will contains bucketId and key
   * @returns Object information
   */
  @Get('/:bucketId/:key')
  async getObject(@Param() params: ParamDto, @Res() res: Response) {
    const { success, message, data, error, statusCode } =
      await this.s3Service.getObject(params);
    return success
      ? res.status(statusCodes.SUCCESS).json({ success, message, data })
      : res
          .status(statusCode ? statusCode : statusCodes.BAD_REQUEST)
          .json({ success, message, error });
  }
  /**
   * @param params Params will contains bucketId and key.
   * @returns delete object information
   */
  @Delete('/:bucketId/:key')
  async deleteObject(@Param() params: ParamDto, @Res() res: Response) {
    const { success, message, data, error, statusCode } =
      await this.s3Service.deleteObject(params);
    return success
      ? res.status(statusCodes.SUCCESS).json({ success, message, data })
      : res
          .status(statusCode ? statusCode : statusCodes.BAD_REQUEST)
          .json({ success, message, error });
  }
}
