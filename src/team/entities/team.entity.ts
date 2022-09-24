import { TeamInterface, TeamPrivileges } from "../../types/team";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "../../task/entities/task.entity";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Team extends BaseEntity implements TeamInterface {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    length: 50,
    unique: true
  })
  name: string;

  @Column({
    nullable: true,
    length: 12
  })
  phoneNumber: string | null;

  @Column({
    type: "enum",
    enum: TeamPrivileges,
    default: TeamPrivileges.Production,
    nullable: false
  })
  teamPrivileges: TeamPrivileges;

  @ManyToMany((type) => User, (entity) => entity.assignedTeam)
  @JoinTable()
  assignedUser: User[];

  @ManyToMany((type) => Task, (entity) => entity.assignedTeam)
  @JoinTable()
  assignedTask: Task[];
}
