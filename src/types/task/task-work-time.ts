import { User } from "../../user/entities/user.entity";
import { Task } from "../../task/entities/task.entity";

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
