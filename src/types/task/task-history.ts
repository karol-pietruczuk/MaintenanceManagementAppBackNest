import { Task } from "../../task/entities/task.entity";
import { User } from "../../user/entities/user.entity";
import { AssignedUser } from "../user";

export enum TaskHistoryAction {
  Created = "Created",
  Edited = "Edited",
  StatusChanged = "StatusChanged",
  Closed = "Closed",
}

export interface TaskHistoryInterface {
  id: string;
  task: Task;
  action: TaskHistoryAction;
  user: User;
  date: Date;
}

export interface AssignedTaskHistory
  extends Pick<TaskHistoryInterface, "id" | "action" | "date"> {
  user: AssignedUser;
}
