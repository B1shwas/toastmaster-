import { AxiosError } from "axios";

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string; error?: string };
    return data?.message || data?.error || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}

export function isApiError(error: unknown): error is AxiosError<ApiError> {
  return error instanceof AxiosError;
}
