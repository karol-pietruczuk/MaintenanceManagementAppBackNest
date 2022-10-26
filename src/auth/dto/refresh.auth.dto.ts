import { AuthRefreshRequest } from "../../types/auth/auth";
import { IsNotEmpty } from "class-validator";

export class RefreshAuthDto implements AuthRefreshRequest {
  @IsNotEmpty()
  jwt: string;
}
