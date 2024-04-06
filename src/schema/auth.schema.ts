import { z } from 'zod';
import { EMAIL_REGEX } from '../constants/regex.constant';
export const resendTokenSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email({ message: 'Invalid email format' })
    .regex(EMAIL_REGEX, { message: 'Invalid email format' }),
});
export const verifyAccountSchema = z.object({
  email: z
    .string({
      required_error: 'Business email is required',
    })
    .email({ message: 'Invalid email format' })
    .regex(EMAIL_REGEX, { message: 'Invalid email format' }),

  token: z
    .string({
      required_error: 'Verification token is required',
    })
    .min(6, 'Fewer characters for a token')
    .max(6, 'Too many characters for a token'),
});
