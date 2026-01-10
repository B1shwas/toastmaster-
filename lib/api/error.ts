import { AxiosError } from "axios";

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as {
      message?: string;
      error?: string | { message?: string; error?: string };
    };

    if (data?.error && typeof data.error === "object") {
      return data.error.message || data.error.error || error.message;
    }

    return (
      data?.message ||
      (typeof data?.error === "string" ? data.error : undefined) ||
      error.message
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}

export function isApiError(error: unknown): error is AxiosError<ApiError> {
  return error instanceof AxiosError;
}
