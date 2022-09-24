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
    length: 255,
    unique: true,
    nullable: false
  })
  email: string;

  @Column({
    length: 50,
    nullable: false
  })
  name: string;

  @Column({
    length: 100,
    nullable: false
  })
  surname: string;

  @Column({
    length: 255,
    nullable: false
  })
  pwdHash: string;

  @Column({
    nullable: true,
    length: 12
  })
  phoneNumber: string | null;

  @Column({
    type: "enum",
    enum: UserRole,
    nullable: false,
    default: UserRole.Production
  })
  role: UserRole;

  @ManyToMany((type) => Team, (entity) => entity.assignedUser)
  assignedTeam: Team[];

  @ManyToMany((type) => Task, (entity) => entity.assignedUser)
  @JoinTable()
  assignedTask: Task[];

  @Column({
    nullable: true
  })
  currentToken: string;

  @OneToMany((type) => Task, (entity) => entity.createdBy)
  createdTask: Task[];

  @OneToMany((type) => Task, (entity) => entity.toBeConfirmBy)
  taskToBeConfirm: Task[];

  @OneToMany((type) => TaskComment, (entity) => entity.createdBy)
  createdTaskComment: TaskComment[];
}
