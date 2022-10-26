import { Response } from "express";

export interface AuthLoginRequest {
  email: string;
  pwd: string;
}

export interface AuthRefreshRequest {
  jwt: string;
}

export interface AuthLoginResponse {
  jwt: string;
  user: {
    name: string;
    surname: string;
    email: string;
    role: string;
  };
}

export interface AuthRefreshResponse extends Response {
  jwt: string;
}
