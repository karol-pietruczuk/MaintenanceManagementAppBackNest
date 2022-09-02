import { TeamInterface, TeamPrivileges } from "../../types/team";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "../../task/entities/task.entity";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Team extends BaseEntity implements TeamInterface {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    length: 50
  })
  name: string;

  @Column() // @TODO How to validate phone number? Which type for phoneNumber is the best?
  phoneNumber: number | null;

  @Column()
  teamPrivileges: TeamPrivileges;

  @ManyToMany((type) => User, (entity) => entity.assignedTeam)
  @JoinTable()
  teamMembers: User[];

  @ManyToMany((type) => Task, (entity) => entity.assignedTeam)
  @JoinTable()
  assignedTask: Task[];
}
