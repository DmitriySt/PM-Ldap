import { ValidationError } from '@nestjs/common';

interface IValidationPipeError {
  name: string;
  errors: string[];
}
export const validationPipeError = (
  errors: ValidationError[],
): IValidationPipeError[] => {
  return errors.map((error) => {
    const errors = [];
    for (const key in error.constraints) {
      if (error.constraints.hasOwnProperty(key)) {
        errors.push(error.constraints[key]);
      }
    }

    return {
      name: error.property,
      errors,
    };
  });
};
