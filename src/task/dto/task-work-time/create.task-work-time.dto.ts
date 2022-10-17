import { CreateTaskWorkTimeRequest, TaskWorkTimeAction } from "../../../types/task/task-work-time";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateTaskWorkTimeDto implements CreateTaskWorkTimeRequest {
  @IsEnum(TaskWorkTimeAction)
  @IsNotEmpty()
  action: TaskWorkTimeAction;

  @IsString()
  @IsNotEmpty()
  taskId: string;
}
