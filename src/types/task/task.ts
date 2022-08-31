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

export interface createTaskResponse extends taskInterface {
}
