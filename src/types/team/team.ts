import { Task } from "../../task/entities/task.entity";
import { User } from "../../user/entities/user.entity";
import { AssignedUserResponse } from "../user";

export interface TeamInterface {
  id: string;
  name: string;
  phoneNumber: string | null;
  assignedUser: User[];
  assignedTask: Task[];
}

export interface CreateTeamRequest
  extends Pick<TeamInterface, "name" | "phoneNumber"> {
  assignedUser: string[];
  assignedTask: string[];
}

export interface UpdateTeamRequest
  extends Pick<TeamInterface, "name" | "phoneNumber"> {
  assignedUser: string[];
  assignedTask: string[];
}

interface AssignedTeam extends Pick<TeamInterface, "id" | "name"> {
}

export type AssignedTeamResponse = AssignedTeam[];

interface TeamResponse
  extends Pick<TeamInterface, "id" | "name" | "phoneNumber"> {
  assignedUser: AssignedUserResponse;
}

interface OneOfManyTeamResponse
  extends Pick<TeamInterface, "id" | "name" | "phoneNumber"> {
}

type ManyUserResponse = OneOfManyTeamResponse[];

export interface CreateTeamResponse extends TeamResponse {
}

export type FindAllTeamResponse = ManyUserResponse;

export interface FindOneTeamResponse extends TeamResponse {
}

export interface UpdateTeamResponse extends TeamResponse {
}

export interface RemoveTeamResponse extends Pick<TeamInterface, "id"> {
}
