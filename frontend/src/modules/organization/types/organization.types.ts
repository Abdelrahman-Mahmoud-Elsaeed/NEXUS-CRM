export interface Organization {
  id: string;
  name: string;
  avatar: string | null;
  role: "OWNER" | "ADMIN" | "MEMBER";
  createdAt: string;
}

export interface OrganizationMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  avatar: string | null;
}

export interface InviteUserRequestDto {
  email: string;
  role: "ADMIN" | "MEMBER";
}

export interface AcceptInviteRequestDto {
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  reason?: string;
}

export interface ApiSingleResponse<T> {
  success: boolean;
  data: T;
  reason?: string;
}