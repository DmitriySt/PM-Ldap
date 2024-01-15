import { AxiosError } from "axios";

export interface IValidationErrors {
  name: string;
  errors: string[];
}

export interface IError {
  code: number;
  message: string;
  validationErrors?: IValidationErrors[];
}

export const AppError = (e: unknown): IError => {
  const error: IError = {
    code: 1,
    message: "",
  };
  if (typeof e === "string") {
    error.message = e.toUpperCase();
  } else if (e instanceof AxiosError) {
    error.code = e?.response?.status ? e.response.status : 1;
    error.message = e?.response?.data.message
      ? e.response.data.message
      : e.message;
    if (e?.response?.data.validationErrors) {
      error.validationErrors = e.response.data.validationErrors;
    }
  } else if (e instanceof Error) {
    error.message = e.message;
  }
  return error;
};
