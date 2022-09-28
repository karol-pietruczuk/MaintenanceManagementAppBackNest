import { RefreshAuthRequest } from "../../types/auth/auth";
import { IsNotEmpty } from "class-validator";

export class RefreshAuthDto implements RefreshAuthRequest {
  @IsNotEmpty()
  jwt: string;
}
