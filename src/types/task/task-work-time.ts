import { User } from "../../user/entities/user.entity";
import { Task } from "../../task/entities/task.entity";
import { AssignedUser } from "../user";

export enum TaskWorkTimeAction {
  start = "start",
  stop = "stop",
}

export interface TaskWorkTimeInterface {
  id: string;
  user: User;
  task: Task;
  changedAt: Date;
  action: TaskWorkTimeAction;
}

export type TaskWorkTimeResponse = {
  isWorking: boolean;
  workTime: number;
  user: Omit<AssignedUser, "assignedTeam">;
}[];

export interface CreateTaskWorkTimeRequest
  extends Pick<TaskWorkTimeInterface, "action"> {
  taskId: string;
}

export interface CreateTaskWorkTimeResponse extends TaskWorkTimeResponse {
}
