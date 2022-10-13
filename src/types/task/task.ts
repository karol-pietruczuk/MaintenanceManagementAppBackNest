import { Team } from "../../team/entities/team.entity";
import { Task } from "../../task/entities/task.entity";
import { User } from "../../user/entities/user.entity";
import { TaskComment } from "../../task/entities/task-comment.entity";
import { TaskHistory } from "../../task/entities/task-history.entity";
import { TaskSeen } from "../../task/entities/task-seen.entity";
import { AssignedTeamResponse } from "../team";
import { AssignedUserResponse } from "../user";
import { TaskWorkTime } from "../../task/entities/task-work-time.entity";

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
  taskWorkTime: TaskWorkTime[];
}

export class TaskRelations
  implements Pick<TaskInterface,
    | "createdBy"
    | "toBeConfirmBy"
    | "assignedTeam"
    | "assignedUser"
    | "assignedTask"
    | "taskHistory"
    | "taskSeen"
    | "comments"
    | "taskWorkTime"> {
  assignedTask: Task[];
  assignedTeam: Team[];
  assignedUser: User[];
  comments: TaskComment[];
  createdBy: User;
  toBeConfirmBy: User;
  taskHistory: TaskHistory[];
  taskSeen: TaskSeen[];
  taskWorkTime: TaskWorkTime[];
}

export interface CreateTaskRequest
  extends Pick<TaskInterface, "name" | "description" | "priority"> {
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

interface AssignedTask
  extends Pick<TaskInterface,
    "id" | "name" | "description" | "status" | "priority" | "createdAt"> {
}

export type AssignedTaskResponse = AssignedTask[];

export interface TaskResponse
  extends Pick<TaskInterface,
    | "id"
    | "name"
    | "description"
    | "status"
    | "priority"
    | "createdBy"
    | "toBeConfirmBy"
    | "totalWorkTime"
    | "createdAt"
    | "changedAt"
    | "comments"> {
  assignedTask: AssignedTaskResponse;
  assignedTeam: AssignedTeamResponse;
  assignedUser: AssignedUserResponse;
}

interface OneOfManyTaskResponse
  extends Pick<TaskInterface,
    "id" | "name" | "description" | "status" | "priority" | "createdAt"> {
  assignedTeam: AssignedTeamResponse;
  assignedUser: AssignedUserResponse;
}

export type ManyTasksResponse = OneOfManyTaskResponse[];

export interface CreateTaskResponse extends TaskResponse {
}

export type FindAndCountTaskResponse = {
  tasks: ManyTasksResponse;
  totalPages: number;
  totalTasksCount: number;
};

export interface FindOneTaskResponse extends TaskResponse {
}

export interface UpdateTaskResponse extends TaskResponse {
}

export interface RemoveTaskResponse extends Pick<TaskInterface, "id"> {
}
