import { UserInterface } from "../../types/user";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Team } from "../../team/entities/team.entity";
import { Task } from "../../task/entities/task.entity";

@Entity()
export class User extends BaseEntity implements UserInterface {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    length: 255
  })
  email: string;

  @Column({
    length: 50
  })
  name: string;

  @Column({
    length: 100
  })
  surname: string;

  @Column({
    length: 255
  })
  pwdHash: string;

  @Column()
  phoneNumber: number | null;

  @ManyToMany((type) => Team, (entity) => entity.teamMembers)
  assignedTeam: Team[];

  @ManyToMany((type) => Task, (entity) => entity.assignedUser)
  @JoinTable()
  assignedTask: Task[];

  @Column()
  currentToken: string;
}
