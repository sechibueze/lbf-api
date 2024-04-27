import { z } from 'zod';
import { UUID_REGEX } from '../constants/regex.constant';

export const createProductSchema = z.object({
  venture: z.string().regex(UUID_REGEX, { message: 'Invalid Business ID' }),
  segment: z
    .string({
      required_error: 'Product category is required',
      invalid_type_error: 'Product category is invalid',
    })
    .regex(UUID_REGEX, { message: 'Invalid Category supplied' }),
  owner: z
    .string({
      required_error: 'User is required',
      invalid_type_error: 'User ID is invalid',
    })
    .regex(UUID_REGEX, { message: 'Invalid User ID supplied' })
    .optional(),
  name: z.string({
    required_error: 'Product name is required',
  }),
  amount: z
    .string({
      required_error: 'Product amount is required',
      invalid_type_error: 'Amount must be a number',
    })
    .regex(/^\d+(\.\d{1,2})?$/, { message: 'Invalid amount supplied' })
    .or(z.number()),

  unit: z.string({
    required_error: 'Product unit is required',
  }),
  image: z
    .string({
      required_error: 'Product image is required',
    })
    .optional(),
  tags: z.string().optional(),
  description: z.string({ required_error: 'Product description is required' }),
});
