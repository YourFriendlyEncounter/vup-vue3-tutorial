import { SchemaOf, ValidationError } from "yup";

/* Transform an array of errors into an object with errors. */
export type IValidationErrorSchema<T extends string | number | symbol = string> = Partial<Record<T, string | undefined>>;
export const transformYupErrorsIntoObject = (errors: ValidationError): Record<string, string> => {
  const validationErrors: Record<string, string> = {};

  errors.inner.forEach((error: any) => {
    if (error.path !== undefined) {
      validationErrors[error.path] = error.errors[0];
    }
  });

  return validationErrors;
};

/* Validate the model and retrieve the errors. */
export interface IValidationResponse {
  isValid: boolean;
  errors: IValidationErrorSchema;
}
export const validateSchema = async <T>(schema: SchemaOf<any>, model: T): Promise<IValidationResponse> => {
  try {
    await schema.validate(model, { abortEarly: false });
    return {
      isValid: true,
      errors: {},
    };
  } catch (e) {
    return {
      isValid: false,
      errors: transformYupErrorsIntoObject(e as ValidationError),
    };
  }
};
