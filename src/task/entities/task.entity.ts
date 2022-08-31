import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { taskInterface, TaskPriority, TaskStatus } from "../../types";
import { TaskComment } from "./task-comment.entity";

@Entity()
export class Task extends BaseEntity implements taskInterface {
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
  createdBy: string; //@TODO Add there ManyToOne Relation to User entity

  @Column({
    nullable: false
  })
  toBeConfirmBy: string; //@TODO Add there ManyToOne Relation to User entity

  @Column()
  assignedTeam: string; //@TODO Add there ManyToMany Relation to UserTeam entity

  @Column()
  assignedUser: string; //@TODO Add there ManyToMany Relation to User entity

  @Column()
  assignedTask: string; //@TODO Add there ManyToMany Relation to Task entity

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
}
