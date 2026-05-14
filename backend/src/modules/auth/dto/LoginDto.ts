import { ApiResponse } from "@/shared/types/api.types";
import { UserProfileDto } from "./user-profile.dto";

export type LoginRequestDto = {
  email: string;
  password: string;
};
export type LoginServiceResult = ApiResponse<UserProfileDto, "INVALID_CREDENTIALS" | "USER_DISABLED">;

export type LoginResult = ApiResponse<{ user: UserProfileDto, tokens: { accessToken: string }; }, "INVALID_CREDENTIALS" | "USER_DISABLED">