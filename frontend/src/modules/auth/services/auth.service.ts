// src/modules/auth/services/auth.service.ts
import { api } from "@/lib/axios"; 
import type {
  LoginRequestDto,
  LoginResult,
  RegisterRequestDto,
  RegisterResponseDto,
  ForgetPasswordResult,
  ResetPasswordResult,
  VerifyEmailResult,
  RequestOtpResult,
  VerifyResetTokenResult,
  VerifyAccessTokenResult,
} from "@/shared/types/auth.types";

const AUTH_BASE = "/auth";

export const AuthService = {

  register: async (data: RegisterRequestDto): Promise<RegisterResponseDto> => {
    const response = await api.post(`${AUTH_BASE}/register`, data);
    return response.data; 
  },

  login: async (data: LoginRequestDto): Promise<LoginResult> => {
    const response = await api.post(`${AUTH_BASE}/login`, data);
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ForgetPasswordResult> => {
    const response = await api.post(`${AUTH_BASE}/password/forgot`, { email });
    return response.data;
  },


  resetPassword: async (
    password: string,
    token: string,
  ): Promise<ResetPasswordResult> => {
    const response = await api.post(`${AUTH_BASE}/password/reset`, {
      newPassword:password,
      token,
    });

    return response.data;
  },

  verifyEmail: async (OTP: string): Promise<VerifyEmailResult> => {
    const response = await api.post(`${AUTH_BASE}/email/verify`, { OTP });
    return response.data;
  },


  requestOtp: async (): Promise<RequestOtpResult> => {
    const response = await api.post(`${AUTH_BASE}/email/otp`);
    return response.data;
  },

  verifyResetToken: async (token: string): Promise<VerifyResetTokenResult> => {
    const response = await api.get(`${AUTH_BASE}/verifyPasswordResetToken/${token}`);
    return response.data;
  },
  verifyAccessToken: async (): Promise<VerifyAccessTokenResult> => {
    const response = await api.get(`${AUTH_BASE}/verifyAccessToken`);
    return response.data;
  },
};

