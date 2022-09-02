import { Team } from "../../team/entities/team.entity";
import { Task } from "../../task/entities/task.entity";

export interface UserInterface {
  id: string;
  email: string;
  name: string;
  surname: string;
  pwdHash: string;
  phoneNumber: number | null;
  currentToken: string;
  assignedTeam: Team[];
  assignedTask: Task[];
}
