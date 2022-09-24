import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { FindAndCountTaskRequest, TaskPriority, TaskStatus } from "../../types";

export class FindAndCountTaskDto implements FindAndCountTaskRequest {
  @IsString()
  searchTerm: string;

  @IsOptional()
  @IsEnum(TaskStatus, { each: true })
  searchStatus: TaskStatus[] | undefined;

  @IsOptional()
  @IsEnum(TaskPriority, { each: true })
  searchPriority: TaskPriority[] | undefined;

  @IsOptional()
  @IsArray()
  searchAssignedTeamId: string[] | undefined;

  @IsOptional()
  @IsArray()
  searchAssignedUserId: string[] | undefined;

  @IsNumber()
  @Max(50)
  @Min(1)
  @IsNotEmpty()
  maxOnPage: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  currentPage: number;
}
