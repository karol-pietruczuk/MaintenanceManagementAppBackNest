import { AuthLoginRequest } from "../../types/auth/auth";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginAuthDto implements AuthLoginRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  pwd: string;
}
