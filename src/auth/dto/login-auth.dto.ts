import { LoginAuthRequest } from "../../types/auth/auth";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginAuthDto implements LoginAuthRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  pwd: string;
}
