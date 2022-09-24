import { UpdateUserRequest, UserRole } from "../../types/user";
import { IsEnum, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class UpdateUserDto implements UpdateUserRequest {
  @IsOptional()
  @IsString({ each: true })
  assignedTeam: string[];

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsPhoneNumber("PL")
  phoneNumber: string | null;

  @IsOptional()
  @IsString()
  pwd: string;

  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  surname: string;
}
