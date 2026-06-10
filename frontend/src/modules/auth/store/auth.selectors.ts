import type { AuthState } from "../types/auth.types";

export const selectAuth = (state: { auth: AuthState }) => state.auth;