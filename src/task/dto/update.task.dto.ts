import { TaskPriority, TaskStatus, UpdateTaskRequest } from "../../types";

export class UpdateTaskDto implements UpdateTaskRequest {
  status: TaskStatus;
  priority: TaskPriority;
  assignedTeam: string[];
  assignedUser: string[];
  assignedTask: string[];
  toBeConfirmBy: string;
}
