import { z } from 'zod';

export const createLBFItemSchema = z.object({
  name: z.string({
    required_error: 'Item name is required',
  }),
  description: z.string({ required_error: 'Item description is required' }),
  pickup_point: z.string({
    required_error: 'Pictup point is required',
  }),
  image: z
    .string({
      required_error: 'Item image is required',
    })
    .optional(),
  tags: z.string().optional(),
});
