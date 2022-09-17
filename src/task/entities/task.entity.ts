import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TaskInterface, TaskPriority, TaskStatus } from "../../types";
import { TaskComment } from "./task-comment.entity";
import { Team } from "../../team/entities/team.entity";
import { User } from "../../user/entities/user.entity";

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

  @Column({
    nullable: false
  })
  createdBy: string; //@TODO Add there ManyToOne Relation to User entity and change entity to "creatorUserId"

  @Column({
    nullable: true
  })
  toBeConfirmBy: string; //@TODO Add there ManyToOne Relation to User entity and change entity to "confirmUserId"

  @ManyToMany((type) => Team, (entity) => entity.assignedTask)
  assignedTeam: Team[];

  @ManyToMany((type) => User, (entity) => entity.assignedTask)
  assignedUser: User[]; //@TODO Add there ManyToMany Relation to User entity

  @ManyToMany((type) => Task, (entity) => entity.assignedTask)
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

  @OneToMany((type) => TaskComment, (entity) => entity.task)
  comments: TaskComment[];

  // @TODO Add there a field with relation ManyToMany with User to know user is working or not and know working time.
  // // Or maybe another entity/table.
}
