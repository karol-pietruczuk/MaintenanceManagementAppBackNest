export interface LoginAuthRequest {
  email: string;
  pwd: string;
}

export interface RefreshAuthRequest {
  jwt: string;
}
