import { z } from 'zod';
import {
  EMAIL_REGEX,
  FULL_NAME_REGEX,
  PASSWORD_REGEX,
  PHONE_NUMBER_REGEX,
} from '../constants/regex.constant';

export const loginUserSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email({ message: 'Invalid email format' })
    .regex(EMAIL_REGEX, { message: 'Invalid email format' }),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      PASSWORD_REGEX,
      'Password must contain at least one uppercase, one lowercase, one number, and one special character'
    ),
});
export const createUserSchema = z
  .object({
    full_name: z
      .string({
        required_error: 'Full name is required',
        invalid_type_error: 'Full name must be alphabets',
      })
      .min(1)
      .max(255)
      .regex(FULL_NAME_REGEX, 'Enter Firstname Lastname'),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({ message: 'Invalid email format' })
      .regex(EMAIL_REGEX, { message: 'Invalid email format' }),
    phone_number: z
      .string({
        required_error: 'Phone number is required',
      })
      .regex(PHONE_NUMBER_REGEX, { message: 'Invalid phone number' }),
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
