export type ApiResponse<T = void, E = string> =
  | { success: true; data: T  }
  | { success: false; reason: E , msg: string };

/**
 * T = The successful data payload type (Defaults to void)
 * R = A union string literal of specific error codes (Defaults to string)
 */
export type ServiceResult<T, E extends string = string> =
  | {
      success: true;
      statusCode: number;
      data: T;
      reason?: never;
    }
  | {
      success: false;
      statusCode: number;
      data?: never;
      reason: E;
      msg: string
    };
