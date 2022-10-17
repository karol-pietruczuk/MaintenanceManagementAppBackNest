import { Team } from "../../team/entities/team.entity";
import { Task } from "../../task/entities/task.entity";
import { TaskComment } from "../../task/entities/task-comment.entity";
import { TaskHistory } from "../../task/entities/task-history.entity";
import { TaskSeen } from "../../task/entities/task-seen.entity";
import { AssignedTeamResponse } from "../team";
import { TaskWorkTime } from "../../task/entities/task-work-time.entity";

export enum UserRole {
  Admin = "Admin",
  Manager = "Manager",
  Technician = "Technician",
  Warehouseman = "Warehouseman",
  Production = "Production",
}

export interface UserInterface {
  id: string;
  email: string;
  name: string;
  surname: string;
  pwdHash: string;
  phoneNumber: string | null;
  roles: UserRole;
  accessToken: string[];
  assignedTeam: Team[];
  assignedTask: Task[];
  createdTask: Task[];
  taskToBeConfirm: Task[];
  createdTaskComment: TaskComment[];
  refreshToken: string[];
  accessTokenExpire: number[];
  refreshTokenTokenExpire: number[];
  ip: string[];
  userAgent: string[];
  taskHistory: TaskHistory[];
  taskSeen: TaskSeen[];
  taskWorkTime: TaskWorkTime[];
}

export class UserRelations
  implements Pick<UserInterface,
    | "assignedTeam"
    | "assignedTask"
    | "createdTask"
    | "taskToBeConfirm"
    | "createdTaskComment"
    | "taskHistory"
    | "taskSeen"
    | "taskWorkTime"> {
  assignedTask: Task[] = null;
  assignedTeam: Team[] = null;
  createdTask: Task[] = null;
  createdTaskComment: TaskComment[] = null;
  taskHistory: TaskHistory[] = null;
  taskSeen: TaskSeen[] = null;
  taskToBeConfirm: Task[] = null;
  taskWorkTime: TaskWorkTime[] = null;
}

export class AuthData
  implements Pick<UserInterface,
    | "accessToken"
    | "refreshToken"
    | "accessTokenExpire"
    | "refreshTokenTokenExpire"
    | "ip"
    | "userAgent"> {
  accessToken: string[] = null;
  refreshToken: string[] = null;
  accessTokenExpire: number[] = null;
  refreshTokenTokenExpire: number[] = null;
  ip: string[] = null;
  userAgent: string[] = null;
}

export interface AssignedUser
  extends Pick<UserInterface, "id" | "name" | "surname"> {
  assignedTeam: AssignedTeamResponse;
}

export type AssignedUserResponse = AssignedUser[];

export interface CreateUserRequest
  extends Pick<UserInterface,
    "email" | "name" | "surname" | "phoneNumber" | "roles"> {
  pwd: string;
  assignedTeam: string[];
}

export interface UpdateUserRequest
  extends Pick<UserInterface,
    "email" | "name" | "surname" | "phoneNumber" | "roles"> {
  pwd: string;
  assignedTeam: string[];
}

export interface UserResponse
  extends Pick<UserInterface,
    "name" | "id" | "email" | "surname" | "phoneNumber" | "roles"> {
  assignedTeam: AssignedTeamResponse;
}

interface OneOfManyUserResponse
  extends Pick<UserInterface, "name" | "id" | "surname" | "roles"> {
  assignedTeam: AssignedTeamResponse;
}

export type ManyUserResponse = OneOfManyUserResponse[];

export interface CreateUserResponse extends UserResponse {
}

export type FindAllUserResponse = ManyUserResponse;

export interface FindOneUserResponse extends UserResponse {
}

export interface UpdateUserResponse extends UserResponse {
}

export interface RemoveUserResponse extends Pick<UserInterface, "id"> {
}
