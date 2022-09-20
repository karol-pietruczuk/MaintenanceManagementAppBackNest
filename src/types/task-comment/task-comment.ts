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

export interface CreateTaskCommentRequest
  extends Pick<TaskCommentInterface, "description" | "publicVisibility"> {
  createdBy: string;
  taskId: string;
}

export interface UpdateTaskCommentRequest
  extends Pick<TaskCommentInterface, "description" | "publicVisibility"> {
}

export interface CreateTaskCommentResponse extends TaskCommentInterface {
}

export interface UpdateTaskCommentResponse extends TaskCommentInterface {
}

export interface RemoveTaskCommentResponse
  extends Pick<TaskCommentInterface, "id"> {
}
