import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskCommentDto } from "./dto/task-comment/create.task-comment.dto";
import { UpdateTaskCommentDto } from "./dto/task-comment/update.task-comment.dto";
import { TaskComment } from "./entities/task-comment.entity";
import {
  AssignedTaskCommentResponse,
  CreateTaskCommentResponse,
  RemoveTaskCommentResponse,
  TaskCommentRelations,
  UpdateTaskCommentResponse,
  UserRole
} from "../types";
import { TaskService } from "./task.service";
import { UserService } from "../user/user.service";
import { In } from "typeorm";
import { assignProperties, nullProperties } from "../utils/accessory-functions";
import { User } from "../user/entities/user.entity";

@Injectable()
export class TaskCommentService {
  constructor(
    @Inject(forwardRef(() => TaskService)) private taskService: TaskService,
    @Inject(forwardRef(() => UserService)) private userService: UserService
  ) {
  }

  filterAssignedTaskComment(
    taskComments: TaskComment[]
  ): AssignedTaskCommentResponse {
    return taskComments?.map((taskComment) => {
      return {
        id: taskComment.id,
        description: taskComment.description,
        createdAt: taskComment.createdAt,
        createdBy: this.userService.filterAssignedUserResponse([
          taskComment.createdBy
        ])[0]
      };
    });
  }

  async create(
    createTaskCommentDto: CreateTaskCommentDto,
    user: User
  ): Promise<CreateTaskCommentResponse> {
    const task = await this.taskService.findOneBlank(
      createTaskCommentDto.taskId
    );

    const taskComment = new TaskComment();
    assignProperties(createTaskCommentDto, taskComment);
    taskComment.task = task;
    taskComment.createdBy = user;

    if (
      taskComment.publicVisibility === false &&
      (user.roles === UserRole.Production ||
        user.roles === UserRole.Warehouseman)
    )
      taskComment.publicVisibility = true;

    await taskComment.save();

    return await TaskComment.find({
      where: {
        task: { id: task.id },
        publicVisibility: [
          UserRole.Admin,
          UserRole.Manager,
          UserRole.Technician
        ].some((role) => role === user.roles)
          ? In([true, false])
          : true
      },
      relations: { createdBy: true },
      select: {
        createdBy: { id: true, name: true, surname: true },
        id: true,
        description: true,
        createdAt: true
      },
      order: { createdAt: "ASC" }
    });
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

    return await TaskComment.find({
      where: {
        task: { id: taskComment.task.id }
      },
      relations: { createdBy: true },
      select: {
        createdBy: { id: true, name: true, surname: true },
        id: true,
        description: true,
        createdAt: true
      },
      order: { createdAt: "ASC" }
    });
  }

  async remove(id: string): Promise<RemoveTaskCommentResponse> {
    const taskComment = await this.findOne(id);
    nullProperties(taskComment, TaskCommentRelations);
    await taskComment.save();
    await taskComment.remove();
    return { id };
  }

  async findOne(id: string): Promise<TaskComment> {
    const taskComment = await TaskComment.findOne({
      where: { id },
      relations: { createdBy: true, task: true },
      select: { createdBy: { id: true }, task: { id: true } }
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
