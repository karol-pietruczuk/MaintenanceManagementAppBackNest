import { UserInterface, UserRole } from "../../types/user";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Team } from "../../team/entities/team.entity";
import { Task } from "../../task/entities/task.entity";
import { TaskComment } from "../../task-comment/entities/task-comment.entity";

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

  @Column()
  role: UserRole;

  @ManyToMany((type) => Team, (entity) => entity.assignedUser)
  assignedTeam: Team[];

  @ManyToMany((type) => Task, (entity) => entity.assignedUser)
  @JoinTable()
  assignedTask: Task[];

  @Column()
  currentToken: string;

  @OneToMany((type) => Task, (entity) => entity.createdBy)
  createdTask: Task[];

  @OneToMany((type) => Task, (entity) => entity.toBeConfirmBy)
  taskToBeConfirm: Task[];

  @OneToMany((type) => TaskComment, (entity) => entity.createdBy)
  createdTaskComment: TaskComment[];
}
