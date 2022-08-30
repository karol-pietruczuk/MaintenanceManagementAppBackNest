import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "./task.entity";

@Entity()
export class TaskComment extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: false
  })
  description: string;

  @Column({
    nullable: false
  })
  createdBy: string; //@TODO Add there ManyToOne Relation to User entity

  @Column({
    default: false,
    nullable: false
  })
  public: boolean;

  @ManyToOne((type) => Task, (entity) => entity.comments)
  task: Task;

  @Column({
    default: () => "CURRENT_TIMESTAMP",
    nullable: false
  })
  createdAt: Date;
}
