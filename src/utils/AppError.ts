class AppError extends Error {
  [x: string]: any;
  public statusCode: number;
  public applicationCode: number;
  constructor(message: string, statusCode: number = 500, applicationCode?: number) {
    super(message);
    this.statusCode = statusCode;
    this.applicationCode = applicationCode || statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
