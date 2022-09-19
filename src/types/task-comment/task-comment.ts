import { Task } from "../../task/entities/task.entity";
import { User } from "../../user/entities/user.entity";

export interface TaskCommentInterface {
  id: string;
  description: string;
  createdBy: User;
  publicVisibility: boolean;
  task: Task;
  createdAt: Date;
}
