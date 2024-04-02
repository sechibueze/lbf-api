import { z } from 'zod';

export const validateSchema = (schema, data) => {
  const response = {
    data: null,
    errors: null,
  };
  try {
    const validatedData = schema.parse(data);
    response.data = validatedData;
  } catch (error) {
    const formattedErrors = {};
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        // Extract field name from error message
        const fieldName = err.path.join('.');
        // Map field name to error message
        formattedErrors[fieldName] = err.message;
      });
    }
    response.errors = formattedErrors;
  }

  return response;
};
