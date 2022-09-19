import { TaskPriority, TaskStatus, UpdateTaskRequest } from "../../types";
import { IsArray, IsIn, IsOptional, IsString } from "class-validator";

export class UpdateTaskDto implements UpdateTaskRequest {
  @IsOptional()
  @IsIn(Object.keys(TaskStatus))
  status: TaskStatus;

  @IsOptional()
  @IsIn(Object.keys(TaskPriority))
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
