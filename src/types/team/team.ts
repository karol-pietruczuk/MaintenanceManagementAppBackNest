import { Task } from "../../task/entities/task.entity";
import { User } from "../../user/entities/user.entity";

// export enum TeamPrivileges {
//   Production = 'Production',
//   Technician = 'Technician',
//   Warehouseman = 'Warehouseman',
//   Manager = 'Manager',
//   Admin = 'Admin',
// }

export interface TeamInterface {
  id: string;
  name: string;
  phoneNumber: string | null;
  // teamPrivileges: TeamPrivileges;
  assignedUser: User[];
  assignedTask: Task[];
}

export interface CreateTeamRequest
  extends Omit<TeamInterface, "id" | "assignedUser" | "assignedTask"> {
  assignedUser: string[];
  assignedTask: string[];
}

export interface UpdateTeamRequest
  extends Omit<TeamInterface, "id" | "assignedUser" | "assignedTask"> {
  assignedUser: string[];
  assignedTask: string[];
}

export interface CreateTeamResponse extends TeamInterface {
}

export type FindAllTeamResponse = TeamInterface[];

export interface FindOneTeamResponse extends TeamInterface {
}

export interface UpdateTeamResponse extends TeamInterface {
}

export interface RemoveTeamResponse extends Pick<TeamInterface, "id"> {
}
