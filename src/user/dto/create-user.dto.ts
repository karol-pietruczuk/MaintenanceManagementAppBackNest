import { CreateUserRequest, UserRole } from "../../types/user";
import { IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateUserDto implements CreateUserRequest {
  @IsOptional()
  @IsString({ each: true })
  assignedTeam: string[];

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsPhoneNumber("PL")
  phoneNumber: string | null;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @IsNotEmpty()
  @IsString()
  surname: string;

  @IsNotEmpty()
  @IsString()
  pwd: string;
}
