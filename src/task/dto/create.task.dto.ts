import { CreateTaskRequest, TaskPriority, TaskStatus } from "../../types";
import { IsNotEmpty, IsString } from "class-validator";
import { Team } from "../../team/entities/team.entity";
import { User } from "../../user/entities/user.entity";
import { Task } from "../entities/task.entity";

export class CreateTaskDto implements CreateTaskRequest {
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsString()
  public description: string;

  @IsString()
  status: TaskStatus;

  @IsNotEmpty()
  @IsString()
  public priority: TaskPriority;

  @IsNotEmpty()
  @IsString()
  public createdBy: string;

  @IsString()
  public toBeConfirmBy: string;

  @IsString()
  public assignedTeam: Team[];

  @IsString()
  public assignedUser: User[];

  @IsString()
  public assignedTask: Task[];
}
