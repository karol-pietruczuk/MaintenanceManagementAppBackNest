import { TaskPriority } from "../../types";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsString()
  public description: string;

  @IsNotEmpty()
  @IsString()
  public priority: TaskPriority;

  @IsNotEmpty()
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
