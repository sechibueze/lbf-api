import { z } from 'zod';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../constants/regex.constant';
export const resendTokenSchema = z.object({
  identifier: z.union([
    z
      .string({
        required_error: 'Business email is required',
      })
      .email({ message: 'Invalid email format' })
      .regex(EMAIL_REGEX, { message: 'Invalid email format' }),
    z.string().uuid('Invalid ID format'),
  ]),
});
export const forgotPasswordSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email({ message: 'Invalid email format' })
    .regex(EMAIL_REGEX, { message: 'Invalid email format' }),
});
export const resetPasswordSchema = z
  .object({
    id: z.string({ required_error: 'User ID is required' }),
    token: z
      .string({
        required_error: 'Verification token is required',
      })
      .min(6, 'Fewer characters for a token')
      .max(6, 'Too many characters for a token'),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(8, 'Password must be at least 8 characters long')
      .regex(
        PASSWORD_REGEX,
        'Password must contain at least one uppercase, one lowercase, one number, and one special character'
      ),
    confirm_password: z.string({
      required_error: 'A confirm password is required',
    }),
  })
  .refine(
    (data) => {
      return data.confirm_password === data.password;
    },
    {
      message: 'Ooops! Passwords do not match',
      path: ['confirm_password'],
    }
  );
export const verifyAccountSchema = z.object({
  identifier: z.union([
    z
      .string({
        required_error: 'Business email is required',
      })
      .email({ message: 'Invalid email format' })
      .regex(EMAIL_REGEX, { message: 'Invalid email format' }),
    z.string().uuid('Invalid ID format'),
  ]),
  token: z
    .string({
      required_error: 'Verification token is required',
    })
    .min(6, 'Fewer characters for a token')
    .max(6, 'Too many characters for a token'),
});
