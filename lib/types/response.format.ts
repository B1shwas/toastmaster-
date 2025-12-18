export interface ResponseFormat<T> {
  statusCode: number;
  timestamp: string;
  data: T;
}
