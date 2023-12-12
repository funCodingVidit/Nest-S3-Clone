// src/pipes/validate-request.pipe.ts
import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import * as Joi from 'joi';

@Injectable()
export class ValidateRequestPipe implements PipeTransform<any> {
  constructor(private readonly schema: Joi.ObjectSchema) {}

  async transform(value: any): Promise<any> {
    try {
      // Validate using Joi
      await this.schema.validateAsync(value, { abortEarly: false });
    } catch (error) {
      // If validation fails, check for Joi errors
      if (error.isJoi) {
        throw new BadRequestException(this.buildJoiError(error));
      }

      throw error; // If it's a different type of error, rethrow it
    }

    return value;
  }

  private buildJoiError(error: Joi.ValidationError): string {
    const errorMessages = error.details
      .map((detail) => detail.message)
      .join(', ');
    return errorMessages;
  }
}
