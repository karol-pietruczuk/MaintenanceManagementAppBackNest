import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { FindAndCountTaskRequest, TaskPriority, TaskStatus } from "../../types";

export class FindAndCountTaskDto implements FindAndCountTaskRequest {
  @IsString()
  searchTerm: string;

  @IsArray()
  searchStatus: TaskStatus[];

  @IsArray()
  searchPriority: TaskPriority[];

  @IsArray()
  searchAssignedTeam: string[];

  @IsArray()
  searchAssignedUser: string[];

  @IsNumber()
  @IsNotEmpty()
  maxOnPage: number;

  @IsNumber()
  @IsNotEmpty()
  currentPage: number;
}
