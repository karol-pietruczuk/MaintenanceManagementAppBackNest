import { Task } from "../../task/entities/task.entity";
import { User } from "../../user/entities/user.entity";
import { AssignedUser } from "../user";

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

export interface AssignedTaskComment
  extends Pick<TaskCommentInterface, "id" | "description" | "createdAt"> {
  createdBy: AssignedUser;
}

export type AssignedTaskCommentResponse = AssignedTaskComment[];

export interface TaskCommentResponse
  extends Pick<TaskCommentInterface, "id" | "description" | "createdAt"> {
  createdBy: AssignedUser;
}

export interface CreateTaskCommentResponse extends TaskCommentResponse {
}

export interface UpdateTaskCommentResponse extends TaskCommentResponse {
}

export interface RemoveTaskCommentResponse
  extends Pick<TaskCommentInterface, "id"> {
}
