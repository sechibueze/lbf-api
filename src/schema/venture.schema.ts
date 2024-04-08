import { z } from 'zod';
import { EMAIL_REGEX } from '../constants/regex.constant';

export const SUPPORTED_VENTURE_TYPES = ['Wholesaler', 'Retailer'] as const;

export const createVentureSchema = z.object({
  name: z.string({
    required_error: 'Business name is required',
  }),
  email: z
    .string({
      required_error: 'Business email is required',
    })
    .email({ message: 'Invalid email format' })
    .regex(EMAIL_REGEX, { message: 'Invalid email format' }),
  phone: z.string({
    required_error: 'Business phone number is required',
  }),
  tax_id: z.string({
    required_error: 'TIN is required',
  }),
  logo: z
    .string({
      required_error: 'Upload your business logo',
    })
    .optional(),
  street: z.string({
    required_error: 'Street address is required',
  }),
  city: z.string({
    required_error: 'City is required',
  }),
  state: z.string({
    required_error: 'State is required',
  }),
  country: z.string({
    required_error: 'City is required',
  }),
  zip_code: z
    .string({
      required_error: 'Zip code is required',
    })
    .min(6, 'Fewer characters for a zip code')
    .max(6, 'Too many characters for a zip code'),
  type: z.enum(SUPPORTED_VENTURE_TYPES),
});
