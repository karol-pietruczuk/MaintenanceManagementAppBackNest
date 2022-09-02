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

export interface taskInterface {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdBy: string;
  toBeConfirmBy: string;
  assignedTeam: string;
  assignedUser: string;
  assignedTask: string;
  totalWorkTime: number;
  createdAt: Date;
  changedAt: Date;
}

export interface createTaskRequest extends taskInterface {
}

export interface findAndCountTaskRequest {
  searchTerm: string;
  searchStatus: TaskStatus[];
  searchPriority: TaskPriority[];
  searchAssignedTeam: string[];
  searchAssignedUser: string[];
  maxOnPage: number;
  currentPage: number;
}

export interface updateTaskRequest
  extends Pick<taskInterface, "status" | "priority" | "toBeConfirmBy"> {
  assignedTeam: string[];
  assignedUser: string[];
  assignedTask: string[];
}

export interface createTaskResponse extends taskInterface {
}

export type findAndCountTaskResponse = {
  tasks: taskInterface[];
  totalPages: number;
};

export interface findOneTaskResponse extends taskInterface {
}

export interface updateTaskResponse extends taskInterface {
}
