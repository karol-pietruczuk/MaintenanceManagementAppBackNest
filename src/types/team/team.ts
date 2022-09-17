import { Task } from "../../task/entities/task.entity";
import { User } from "../../user/entities/user.entity";

export enum TeamPrivileges {
  Production = "Production",
  Technician = "Technician",
  Warehouseman = "Warehouseman",
  Manager = "Manager",
  Admin = "Admin",
}

export interface TeamInterface {
  id: string;
  name: string;
  phoneNumber: number | null;
  teamPrivileges: TeamPrivileges;
  assignedUser: User[];
  assignedTask: Task[];
}
