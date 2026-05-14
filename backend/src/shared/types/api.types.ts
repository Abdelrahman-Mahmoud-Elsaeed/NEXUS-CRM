export type ApiResponse<T = void, E = string> = 
  | { success: true; data: T } 
  | { success: false; reason: E };