import { z } from 'zod';
import {
  EMAIL_REGEX,
  FULL_NAME_REGEX,
  PASSWORD_REGEX,
  PHONE_NUMBER_REGEX,
} from '../constants/regex.constant';
const createBusinessSchema = z.object({
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
  type: z.enum(['r', 'w']).optional(),
});
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
export const createUserAndBusinessSchema = z
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
    business: createBusinessSchema,
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
