import { CreateTeamRequest } from "../../types/team";
import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateTeamDto implements CreateTeamRequest {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsPhoneNumber("PL")
  phoneNumber: string | null;

  // @IsNotEmpty()
  // @IsEnum(TeamPrivileges)
  // teamPrivileges: TeamPrivileges;

  @IsOptional()
  @IsString({ each: true })
  assignedTask: string[];

  @IsOptional()
  @IsString({ each: true })
  assignedUser: string[];
}
