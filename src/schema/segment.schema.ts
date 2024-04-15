import { z } from 'zod';

export const createSegmentSchema = z.object({
  name: z.string({
    required_error: 'Segment name is required',
  }),
  image: z
    .string({
      required_error: 'Segment image is required',
    })
    .optional(),
  description: z.string().optional(),
});
