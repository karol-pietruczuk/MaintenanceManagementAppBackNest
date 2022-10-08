import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "./task.entity";
import { TaskHistoryAction, TaskHistoryInterface } from "../../types";
import { User } from "../../user/entities/user.entity";

@Entity()
export class TaskHistory extends BaseEntity implements TaskHistoryInterface {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Task, (entity) => entity.taskHistory)
  task: Task;

  @Column({
    nullable: false,
    type: "enum",
    enum: TaskHistoryAction
  })
  action: TaskHistoryAction;

  @Column({
    nullable: false,
    type: "date"
  })
  date: Date;

  @ManyToOne(() => User, (entity) => entity.taskHistory)
  user: User;
}
