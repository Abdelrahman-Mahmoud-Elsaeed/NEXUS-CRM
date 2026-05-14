import { ApiResponse } from "@/shared/types/api.types";
import { UserProfileDto } from "./user-profile.dto";

export interface RegisterRequistDto {
  email: string;
  password: string;
  name?: string;
}


export type RegisterServiceResult = ApiResponse<UserProfileDto, "EMAIL_IS_USED" >;
export type RegisterResult = ApiResponse<{user: UserProfileDto, tokens: { accessToken: string };}, "EMAIL_IS_USED" | "WEAK_PASSWORD">;