import { CreateTaskRequest, TaskPriority } from "../../types";
import { IsArray, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateTaskDto implements CreateTaskRequest {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @IsNotEmpty()
  @IsString()
  createdBy: string;

  @IsString()
  toBeConfirmBy: string;

  @IsArray()
  assignedTeam: string[];

  @IsArray()
  assignedUser: string[];

  @IsArray()
  assignedTask: string[];
}
