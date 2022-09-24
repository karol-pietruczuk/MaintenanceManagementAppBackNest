import { TaskPriority, TaskStatus, UpdateTaskRequest } from "../../types";
import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateTaskDto implements UpdateTaskRequest {
  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @IsOptional()
  @IsArray()
  assignedTeam: string[];

  @IsOptional()
  @IsArray()
  assignedUser: string[];

  @IsOptional()
  @IsArray()
  assignedTask: string[];

  @IsOptional()
  @IsString()
  toBeConfirmBy: string;
}
