import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { TaskInterface, TaskPriority, TaskStatus } from "../../types";
import { TaskComment } from "./task-comment.entity";
import { Team } from "../../team/entities/team.entity";
import { User } from "../../user/entities/user.entity";
import { TaskHistory } from "./task-history.entity";
import { TaskSeen } from "./task-seen.entity";

@Entity()
export class Task extends BaseEntity implements TaskInterface {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    length: 100,
    nullable: false
  })
  name: string;

  @Column({
    length: 1000
  })
  description: string;

  @Column({
    default: TaskStatus.Reported,
    nullable: false,
    type: "enum",
    enum: TaskStatus
  })
  status: TaskStatus;

  @Column({
    nullable: false,
    type: "enum",
    enum: TaskPriority
  })
  priority: TaskPriority;

  @ManyToOne(() => User, (entity) => entity.createdTask)
  createdBy: User;

  @ManyToOne(() => User, (entity) => entity.taskToBeConfirm)
  toBeConfirmBy: User;

  @ManyToMany(() => Team, (entity) => entity.assignedTask)
  assignedTeam: Team[];

  @ManyToMany(() => User, (entity) => entity.assignedTask)
  assignedUser: User[];

  @ManyToMany(() => Task, (entity) => entity.assignedTask)
  @JoinTable()
  assignedTask: Task[];

  @Column()
  totalWorkTime: number;

  @Column({
    default: () => "CURRENT_TIMESTAMP",
    nullable: false
  })
  createdAt: Date;

  @Column({
    default: () => "CURRENT_TIMESTAMP",
    nullable: false
  })
  changedAt: Date;

  @OneToMany(() => TaskComment, (entity) => entity.task)
  comments: TaskComment[];

  @OneToMany(() => TaskHistory, (entity) => entity.task)
  taskHistory: TaskHistory[];

  @OneToMany(() => TaskSeen, (entity) => entity.task)
  taskSeen: TaskSeen[];

  // @TODO Add there a field with relation ManyToMany with User to know user is working or not and know working time.
  // // Or maybe another entity/table.

  //@TODO Add there updating totalWorkTime and user start/stop work
}
