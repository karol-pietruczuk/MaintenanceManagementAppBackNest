import { TeamPrivileges, UpdateTeamRequest } from "../../types/team";
import { IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class UpdateTeamDto implements UpdateTeamRequest {
  @IsOptional()
  @IsString({ each: true })
  assignedTask: string[];

  @IsOptional()
  @IsString({ each: true })
  assignedUser: string[];

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsPhoneNumber("PL")
  phoneNumber: string | null;

  @IsOptional()
  @IsString()
  teamPrivileges: TeamPrivileges;
}
