export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T | null;
  error?: string | null;
}

export class ResponseHandler {
  static success<T>(
    data: T,
    message: string = "Operation Success",
    statusCode: number = 200
  ): ApiResponse<T> {
    return {
      success: true,
      statusCode,
      message,
      data,
      error: null,
    };
  }

  static error(
    message: string = "Something Went Wrong",
    statusCode: number = 500,
    errorDetails?: string
  ): ApiResponse<null> {
    return {
      success: false,
      statusCode,
      message,
      data: null,
      error: errorDetails || message,
    };
  }

  static created<T>(
    data: T,
    message: string = "Created succces"
  ): ApiResponse<T> {
    return this.success(data, message, 201);
  }

  static notFound(message: string = "Data tidak ditemukan"): ApiResponse<null> {
    return this.error(message, 404);
  }

  static badRequest(
    message: string = "Invalid  type request"
  ): ApiResponse<null> {
    return this.error(message, 400);
  }
}
