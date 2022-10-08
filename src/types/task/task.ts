import { Team } from "../../team/entities/team.entity";
import { Task } from "../../task/entities/task.entity";
import { User } from "../../user/entities/user.entity";
import { TaskComment } from "../../task/entities/task-comment.entity";
import { TaskHistory } from "../../task/entities/task-history.entity";
import { TaskSeen } from "../../task/entities/task-seen.entity";

export enum TaskStatus {
  Reported = "Reported",
  Open = "Open",
  InProgress = "InProgress",
  Paused = "Paused",
  MissingParts = "MissingParts",
  Closed = "Closed",
  Rejected = "Rejected",
}

export enum TaskPriority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

export interface TaskInterface {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdBy: User;
  toBeConfirmBy: User;
  assignedTeam: Team[];
  assignedUser: User[];
  assignedTask: Task[];
  totalWorkTime: number;
  createdAt: Date;
  changedAt: Date;
  comments: TaskComment[];
  taskHistory: TaskHistory[];
  taskSeen: TaskSeen[];
}

export class TaskRelations
  implements Pick<TaskInterface,
    | "createdBy"
    | "toBeConfirmBy"
    | "assignedTeam"
    | "assignedUser"
    | "assignedTask"
    | "comments"> {
  assignedTask: Task[];
  assignedTeam: Team[];
  assignedUser: User[];
  comments: TaskComment[];
  createdBy: User;
  toBeConfirmBy: User;
}

export interface CreateTaskRequest
  extends Omit<TaskInterface,
    | "id"
    | "status"
    | "assignedTask"
    | "assignedTeam"
    | "assignedUser"
    | "totalWorkTime"
    | "createdAt"
    | "changedAt"
    | "createdBy"
    | "toBeConfirmBy"
    | "comments"
    | "taskHistory"
    | "taskSeen"> {
  assignedTask: string[];
  assignedTeam: string[];
  assignedUser: string[];
  createdBy: string;
  toBeConfirmBy: string;
}

export interface FindAndCountTaskRequest {
  searchTerm: string;
  searchStatus: TaskStatus[] | undefined;
  searchPriority: TaskPriority[] | undefined;
  searchAssignedTeamId: string[] | undefined;
  searchAssignedUserId: string[] | undefined;
  maxOnPage: number;
  currentPage: number;
}

export interface UpdateTaskRequest
  extends Pick<TaskInterface, "status" | "priority"> {
  assignedTeam: string[];
  assignedUser: string[];
  assignedTask: string[];
  toBeConfirmBy: string;
}

export interface CreateTaskResponse extends TaskInterface {
}

export type FindAndCountTaskResponse = {
  tasks: TaskInterface[];
  totalPages: number;
  totalTasksCount: number;
};

export interface FindOneTaskResponse extends TaskInterface {
}

export interface UpdateTaskResponse extends TaskInterface {
}

export interface RemoveTaskResponse extends Pick<TaskInterface, "id"> {
}
