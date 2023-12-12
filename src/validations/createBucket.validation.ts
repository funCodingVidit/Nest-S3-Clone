import { Joi } from 'celebrate';
export const createBucketValidationSchema = Joi.object({
  bucketName: Joi.string()
    .required()
    .messages({ 'any.required': 'Bucket Name is mandatory' }),
  isPublic: Joi.boolean().optional(),
});
