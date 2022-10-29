import { UserInterface, UserRole } from "../../types";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Team } from "../../team/entities/team.entity";
import { Task } from "../../task/entities/task.entity";
import { TaskComment } from "../../task/entities/task-comment.entity";
import { TaskHistory } from "../../task/entities/task-history.entity";
import { TaskSeen } from "../../task/entities/task-seen.entity";
import { TaskWorkTime } from "../../task/entities/task-work-time.entity";

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
    length: 255, //@TODO Check if 255 is right. Maybe 128 is enough
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
  roles: UserRole;

  @ManyToMany(() => Team, (entity) => entity.assignedUser)
  assignedTeam: Team[];

  @ManyToMany(() => Task, (entity) => entity.assignedUser)
  @JoinTable()
  assignedTask: Task[];

  @Column("simple-array")
  accessToken: string[];

  @OneToMany(() => Task, (entity) => entity.createdBy)
  createdTask: Task[];

  @OneToMany(() => Task, (entity) => entity.toBeConfirmBy)
  taskToBeConfirm: Task[];

  @OneToMany(() => TaskComment, (entity) => entity.createdBy)
  createdTaskComment: TaskComment[];

  @Column("simple-array")
  refreshToken: string[];

  @Column("simple-array")
  accessTokenExpire: number[];

  @Column("simple-array")
  refreshTokenTokenExpire: number[];

  @Column("simple-array")
  ip: string[];

  @Column("simple-array")
  userAgent: string[];

  @OneToMany(() => TaskHistory, (entity) => entity.user)
  taskHistory: TaskHistory[];

  @OneToMany(() => TaskSeen, (entity) => entity.user)
  taskSeen: TaskSeen[];

  @OneToMany(() => TaskWorkTime, (entity) => entity.user)
  taskWorkTime: TaskWorkTime[];
}
