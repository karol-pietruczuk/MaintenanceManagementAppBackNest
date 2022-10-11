import { CreateTaskCommentRequest } from "../../../types";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateTaskCommentDto implements CreateTaskCommentRequest {
  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  publicVisibility: boolean;

  @IsString()
  @IsNotEmpty()
  taskId: string;
}
