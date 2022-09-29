import { Team } from "../../team/entities/team.entity";
import { Task } from "../../task/entities/task.entity";
import { TaskComment } from "../../task-comment/entities/task-comment.entity";

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
}

export class AuthData
  implements Pick<UserInterface,
    | "accessToken"
    | "refreshToken"
    | "accessTokenExpire"
    | "refreshTokenTokenExpire"
    | "ip"
    | "userAgent"> {
  accessToken: string[];
  refreshToken: string[];
  accessTokenExpire: number[];
  refreshTokenTokenExpire: number[];
  ip: string[];
  userAgent: string[];
}

export interface CreateUserRequest
  extends Omit<UserInterface,
    | "id"
    | "pwdHash"
    | "accessToken"
    | "assignedTeam"
    | "assignedTask"
    | "createdTask"
    | "taskToBeConfirm"
    | "createdTaskComment"
    | "refreshToken"
    | "accessTokenExpire"
    | "refreshTokenTokenExpire"
    | "ip"
    | "userAgent"> {
  pwd: string;
  assignedTeam: string[];
}

export interface UpdateUserRequest
  extends Omit<UserInterface,
    | "id"
    | "pwdHash"
    | "accessToken"
    | "assignedTeam"
    | "assignedTask"
    | "createdTask"
    | "taskToBeConfirm"
    | "createdTaskComment"
    | "refreshToken"
    | "accessTokenExpire"
    | "refreshTokenTokenExpire"
    | "ip"
    | "userAgent"> {
  pwd: string;
  assignedTeam: string[];
}

export interface CreateUserResponse
  extends Omit<UserInterface,
    | "pwdHash"
    | "accessToken"
    | "assignedTask"
    | "createdTask"
    | "taskToBeConfirm"
    | "createdTaskComment"
    | "refreshToken"
    | "accessTokenExpire"
    | "refreshTokenTokenExpire"
    | "ip"
    | "userAgent"> {
}

export type FindAllUserResponse = Omit<UserInterface,
  | "pwdHash"
  | "accessToken"
  | "assignedTask"
  | "createdTask"
  | "taskToBeConfirm"
  | "createdTaskComment"
  | "phoneNumber"
  | "refreshToken"
  | "accessTokenExpire"
  | "refreshTokenTokenExpire"
  | "ip"
  | "userAgent">[];

export interface FindOneUserResponse
  extends Omit<UserInterface,
    | "pwdHash"
    | "accessToken"
    | "createdTask"
    | "taskToBeConfirm"
    | "createdTaskComment"
    | "refreshToken"
    | "accessTokenExpire"
    | "refreshTokenTokenExpire"
    | "ip"
    | "userAgent"> {
}

export interface UpdateUserResponse
  extends Omit<UserInterface,
    | "pwdHash"
    | "accessToken"
    | "assignedTask"
    | "createdTask"
    | "taskToBeConfirm"
    | "createdTaskComment"
    | "refreshToken"
    | "accessTokenExpire"
    | "refreshTokenTokenExpire"
    | "ip"
    | "userAgent"> {
}

export interface RemoveUserResponse extends Pick<UserInterface, "id"> {
}
