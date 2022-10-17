import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "./task.entity";
import { TaskCommentInterface } from "../../types";
import { User } from "../../user/entities/user.entity";

@Entity()
export class TaskComment extends BaseEntity implements TaskCommentInterface {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: false
  })
  description: string;

  @ManyToOne(() => User, (entity) => entity.createdTaskComment)
  createdBy: User;

  @Column({
    default: false,
    nullable: false,
    type: "boolean"
  })
  publicVisibility: boolean;

  @ManyToOne(() => Task, (entity) => entity.comments)
  task: Task;

  @Column({
    default: () => "CURRENT_TIMESTAMP",
    nullable: false
  })
  createdAt: Date;
}
