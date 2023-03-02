export class CustomAPIError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export type CustomAPIErrorType = {
  message: string;
  statusCode: number;
};

export type CustomError = {
  statusCode: number;
  msg: string | { message: string }[];
  status: string;
};
