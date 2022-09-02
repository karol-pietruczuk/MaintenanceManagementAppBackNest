import { Team } from "../../team/entities/team.entity";
import { Task } from "../../task/entities/task.entity";
import { User } from "../../user/entities/user.entity";

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
  createdBy: string;
  toBeConfirmBy: string;
  assignedTeam: Team[];
  assignedUser: User[];
  assignedTask: Task[];
  totalWorkTime: number;
  createdAt: Date;
  changedAt: Date;
}

export interface CreateTaskRequest
  extends Omit<TaskInterface,
    "id" | "assignedTask" | "totalWorkTime" | "createdAt" | "changedAt"> {
}

export interface FindAndCountTaskRequest {
  searchTerm: string;
  searchStatus: TaskStatus[];
  searchPriority: TaskPriority[];
  searchAssignedTeam: string[];
  searchAssignedUser: string[];
  maxOnPage: number;
  currentPage: number;
}

export interface UpdateTaskRequest
  extends Pick<TaskInterface, "status" | "priority" | "toBeConfirmBy"> {
  assignedTeam: string[];
  assignedUser: string[];
  assignedTask: string[];
}

export interface CreateTaskResponse extends TaskInterface {
}

export type FindAndCountTaskResponse = {
  tasks: TaskInterface[];
  totalPages: number;
};

export interface FindOneTaskResponse extends TaskInterface {
}

export interface UpdateTaskResponse extends TaskInterface {
}
