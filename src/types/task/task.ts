import { Team } from "../../team/entities/team.entity";
import { Task } from "../../task/entities/task.entity";
import { User } from "../../user/entities/user.entity";
import { TaskComment } from "../../task-comment/entities/task-comment.entity";

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
    | "comments"> {
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
