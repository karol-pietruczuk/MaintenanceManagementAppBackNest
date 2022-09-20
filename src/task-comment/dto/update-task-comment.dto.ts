import { UpdateTaskCommentRequest } from "../../types/task-comment";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateTaskCommentDto implements UpdateTaskCommentRequest {
  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  publicVisibility: boolean;
}
