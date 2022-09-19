import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { FindAndCountTaskRequest, TaskPriority, TaskStatus } from "../../types";

export class FindAndCountTaskDto implements FindAndCountTaskRequest {
  @IsString()
  searchTerm: string;

  @IsOptional()
  @IsArray() // @TODO Add your own validate decorator to validate if Array is Type TaskStatus[]. See on npm site
    // class-validator.
  searchStatus: TaskStatus[] | undefined;

  @IsOptional()
  @IsArray() // @TODO Add your own validate decorator to validate if Array is Type TaskPriority[]. See on npm site
    // class-validator.
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
