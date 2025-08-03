import Joi from 'joi';

export const passwordResetSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required(),
});
