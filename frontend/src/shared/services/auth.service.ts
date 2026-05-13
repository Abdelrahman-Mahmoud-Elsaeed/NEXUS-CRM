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
} from "@/shared/types/auth.types";

const AUTH_BASE = "/auth";

export const AuthService = {
  /**
   * Register new account
   * Endpoint: /auth/register
   */
  register: async (data: RegisterRequestDto): Promise<RegisterResponseDto> => {
    const response = await api.post(`${AUTH_BASE}/register`, data);
    const token = response.data.tokens.accessToken;
    localStorage.setItem("access_token", token);
    return response.data;
  },

  /**
   * Authenticate user
   * Endpoint: /auth/login
   */
  login: async (data: LoginRequestDto): Promise<LoginResult> => {
    const response = await api.post(`${AUTH_BASE}/login`, data);
    const token = response.data.tokens.accessToken;
    localStorage.setItem("access_token", token);
    return response.data;
  },

  /**
   * Request password reset link
   * Endpoint: /auth/password/forgot
   */
  forgotPassword: async (email: string): Promise<ForgetPasswordResult> => {
    const response = await api.post(`${AUTH_BASE}/password/forgot`, { email });
    return response.data;
  },

  /**
   * Set new password with token
   * Endpoint: /auth/password/reset
   */
  resetPassword: async (
    password: string,
    token: string,
  ): Promise<ResetPasswordResult> => {
    const response = await api.post(`${AUTH_BASE}/password/reset`, {
      password,
      token,
    });
    return response.data;
  },

  /**
   * Finalize email verification via token/link
   * Endpoint: /auth/email/verify
   */
  verifyEmail: async (OTP: string): Promise<VerifyEmailResult> => {
    const response = await api.post(`${AUTH_BASE}/email/verify`, { OTP });
    return response.data;
  },

  /**
   * Request an OTP code
   * Endpoint: /auth/email/otp
   */
  requestOtp: async (): Promise<RequestOtpResult> => {
    const response = await api.post(`${AUTH_BASE}/email/otp`);
    return response.data;
  },
};
