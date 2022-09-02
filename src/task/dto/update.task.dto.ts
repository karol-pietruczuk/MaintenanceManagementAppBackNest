import { TaskPriority, TaskStatus, updateTaskRequest } from "../../types";

export class UpdateTaskDto implements updateTaskRequest {
  status: TaskStatus;
  priority: TaskPriority;
  assignedTeam: string[];
  assignedUser: string[];
  assignedTask: string[];
  toBeConfirmBy: string;
}
