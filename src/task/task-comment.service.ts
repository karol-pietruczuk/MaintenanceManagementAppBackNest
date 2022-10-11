import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskCommentDto } from "./dto/task-comment/create.task-comment.dto";
import { UpdateTaskCommentDto } from "./dto/task-comment/update.task-comment.dto";
import { TaskComment } from "./entities/task-comment.entity";
import { CreateTaskCommentResponse, RemoveTaskCommentResponse, UpdateTaskCommentResponse } from "../types";
import { TaskService } from "./task.service";
import { UserService } from "../user/user.service";
import { In } from "typeorm";
import { assignProperties } from "../utils/accessory-functions";

@Injectable()
export class TaskCommentService {
  constructor(
    @Inject(forwardRef(() => TaskService)) private taskService: TaskService,
    @Inject(forwardRef(() => UserService)) private userService: UserService
  ) {
  }

  async create(
    createTaskCommentDto: CreateTaskCommentDto
  ): Promise<CreateTaskCommentResponse> {
    const task = await this.taskService.findOneBlank(
      createTaskCommentDto.taskId
    );
    const user = await this.userService.findOneBlank(
      createTaskCommentDto.createdBy
    );
    const taskComment = new TaskComment();
    assignProperties(createTaskCommentDto, taskComment);
    taskComment.task = task;
    taskComment.createdBy = user;
    await taskComment.save();

    return taskComment;
  }

  async update(
    id: string,
    updateTaskCommentDto: UpdateTaskCommentDto
  ): Promise<UpdateTaskCommentResponse> {
    const taskComment = await this.findOne(id);
    if (!!updateTaskCommentDto.description)
      taskComment.description = updateTaskCommentDto.description;
    if (updateTaskCommentDto.hasOwnProperty("publicVisibility"))
      taskComment.publicVisibility = updateTaskCommentDto.publicVisibility;
    await taskComment.save();

    return taskComment;
  }

  async remove(id: string): Promise<RemoveTaskCommentResponse> {
    const taskComment = await this.findOne(id);
    taskComment.task = null;
    taskComment.createdBy = null;
    await taskComment.save();
    await taskComment.remove();
    return { id };
  }

  async findMany(idArray: string[] | undefined | null): Promise<TaskComment[]> {
    return idArray
      ? await TaskComment.find({
        where: { id: In(idArray) }
      })
      : null;
  }

  async findOne(id: string) {
    const taskComment = await TaskComment.findOne({
      where: { id },
      relations: { createdBy: true, task: true }
    });
    if (!taskComment)
      throw new NotFoundException({
        message: {
          taskComment: "taskComment not found"
        }
      });
    return taskComment;
  }
}
