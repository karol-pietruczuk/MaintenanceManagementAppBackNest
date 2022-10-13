import { Task } from "../../task/entities/task.entity";
import { User } from "../../user/entities/user.entity";
import { AssignedUser } from "../user";

export interface TaskSeenInterface {
  id: string;
  task: Task;
  user: User;
  date: Date;
}

export interface AssignedTaskSeen
  extends Pick<TaskSeenInterface, "id" | "date"> {
  user: AssignedUser;
}

export type AssignedTaskSeenResponse = AssignedTaskSeen[];
