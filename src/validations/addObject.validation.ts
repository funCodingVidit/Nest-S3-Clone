import { Joi } from 'celebrate';

export const addNewObjectValidationSchema = Joi.object({
  bucketId: Joi.string()
    .required()
    .messages({ 'any.required': 'bucketName is required' }),
  key: Joi.string().required().messages({ 'any.required': 'key is required' }),
  data: Joi.string()
    .required()
    .messages({ 'any.required': 'data is required' }),
});
