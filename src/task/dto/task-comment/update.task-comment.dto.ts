import { IsBoolean, IsOptional, IsString } from "class-validator";
import { UpdateTaskCommentRequest } from "../../../types";

export class UpdateTaskCommentDto implements UpdateTaskCommentRequest {
  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  publicVisibility: boolean;
}
