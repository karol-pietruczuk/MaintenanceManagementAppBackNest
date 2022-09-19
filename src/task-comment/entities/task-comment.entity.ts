import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "../../task/entities/task.entity";
import { TaskCommentInterface } from "../../types/task-comment/task-comment";
import { User } from "../../user/entities/user.entity";

@Entity()
export class TaskComment extends BaseEntity implements TaskCommentInterface {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: false
  })
  description: string;

  @ManyToOne((type) => User, (entity) => entity.createdTaskComment)
  createdBy: User;

  @Column({
    default: false,
    nullable: false
  })
  publicVisibility: boolean;

  @ManyToOne((type) => Task, (entity) => entity.comments)
  task: Task;

  @Column({
    default: () => "CURRENT_TIMESTAMP",
    nullable: false
  })
  createdAt: Date;
}
