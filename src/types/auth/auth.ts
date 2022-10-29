import { UserResponse } from "../user";

export interface AuthLoginRequest {
  email: string;
  pwd: string;
}

export interface AuthRefreshRequest {
  jwt: string;
}

export interface AuthLoginResponse {
  jwt: string;
  user: Pick<UserResponse, "name" | "id" | "surname" | "roles">;
}

export interface AuthRefreshResponse extends AuthLoginResponse {
}

export interface AuthLogoutResponse {
}
