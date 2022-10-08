import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "./task.entity";
import { User } from "../../user/entities/user.entity";
import { TaskSeenInterface } from "../../types";

@Entity()
export class TaskSeen extends BaseEntity implements TaskSeenInterface {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Task, (entity) => entity.taskSeen)
  task: Task;

  @Column({
    nullable: false,
    type: "date"
  })
  date: Date;

  @ManyToOne(() => User, (entity) => entity.taskSeen)
  @JoinColumn()
  user: User;
}
