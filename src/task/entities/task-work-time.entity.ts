import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TaskWorkTimeAction, TaskWorkTimeInterface } from "../../types/task/task-work-time";
import { User } from "../../user/entities/user.entity";
import { Task } from "./task.entity";

@Entity()
export class TaskWorkTime extends BaseEntity implements TaskWorkTimeInterface {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    default: TaskWorkTimeAction.start,
    nullable: false,
    type: "enum",
    enum: TaskWorkTimeAction
  })
  action: TaskWorkTimeAction;

  @Column({
    default: () => "CURRENT_TIMESTAMP",
    nullable: false
  })
  changedAt: Date;

  @ManyToOne(() => User, (entity) => entity.taskWorkTime)
  user: User;

  @ManyToOne(() => Task, (entity) => entity.taskWorkTime)
  task: Task;
}
