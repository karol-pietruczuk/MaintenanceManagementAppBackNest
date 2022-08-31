import { TaskPriority } from "../../types";
import { IsString } from "class-validator";

export class CreateTaskDto {
  @IsString()
  public name: string;

  @IsString()
  public description: string;

  @IsString()
  public priority: TaskPriority;

  @IsString()
  public createdBy: string;

  @IsString()
  public toBeConfirmBy: string;

  @IsString()
  public assignedTeam: string;

  @IsString()
  public assignedUser: string;

  @IsString()
  public assignedTask: string;
}
