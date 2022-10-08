import { Task } from "../../task/entities/task.entity";
import { User } from "../../user/entities/user.entity";

export interface TaskSeenInterface {
  id: string;
  task: Task;
  user: User;
  date: Date;
}
