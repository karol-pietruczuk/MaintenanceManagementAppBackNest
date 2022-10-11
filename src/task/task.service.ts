import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/task/create.task.dto";
import {
  AssignedTaskInterface,
  CreateTaskResponse,
  FindAndCountTaskResponse,
  FindOneTaskResponse,
  ManyTasksResponse,
  OneOfManyTasksResponse,
  RemoveTaskResponse,
  TaskRelations,
  TaskResponse,
  TaskStatus,
  UpdateTaskResponse
} from "../types";
import { Task } from "./entities/task.entity";
import { assignProperties, nullProperties } from "../utils/accessory-functions";
import { FindAndCountTaskDto } from "./dto/task/find-and-count.task.dto";
import { ILike, In } from "typeorm";
import { UserService } from "../user/user.service";
import { TeamService } from "../team/team.service";
import { UpdateTaskDto } from "./dto/task/update.task.dto";
import { TaskCommentService } from "./task-comment.service";

@Injectable()
export class TaskService {
  constructor(
    @Inject(forwardRef(() => TaskCommentService))
    private taskCommentService: TaskCommentService,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(forwardRef(() => TeamService)) private teamService: TeamService
  ) {
  }

  private static filterTaskResponse(task: Task): TaskResponse {
    return {
      assignedTask: task.assignedTask.map(
        (assignedTask): AssignedTaskInterface => {
          return {
            id: assignedTask.id,
            name: assignedTask.name,
            description: assignedTask.description,
            status: assignedTask.status,
            priority: assignedTask.priority,
            createdAt: assignedTask.createdAt
          };
        }
      ),
      changedAt: task.changedAt,
      comments: task.comments,
      createdBy: task.createdBy,
      toBeConfirmBy: task.toBeConfirmBy,
      totalWorkTime: task.totalWorkTime,
      id: task.id,
      name: task.name,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignedTeam: task.assignedTeam,
      assignedUser: task.assignedUser,
      createdAt: task.createdAt
    };
  }

  private static filterManyTasksResponse(tasks: Task[]): ManyTasksResponse {
    return tasks.map((task): OneOfManyTasksResponse => {
      return {
        assignedTeam: task.assignedTeam,
        assignedUser: task.assignedUser,
        createdAt: task.createdAt,
        description: task.description,
        id: task.id,
        name: task.name,
        priority: task.priority,
        status: task.status
      };
    });
  }

  async create(createTaskDto: CreateTaskDto): Promise<CreateTaskResponse> {
    const task = new Task();
    assignProperties(createTaskDto, task);
    task.assignedTeam = await this.teamService.findMany(
      createTaskDto.assignedTeam
    );
    task.assignedUser = await this.userService.findMany(
      createTaskDto.assignedUser
    );
    task.assignedTask = await this.findMany(createTaskDto.assignedTask);
    const creator = await this.userService.findOneBlank(
      createTaskDto.createdBy
    );
    task.createdBy = creator;
    task.toBeConfirmBy = createTaskDto.toBeConfirmBy
      ? await this.userService.findOneBlank(createTaskDto.toBeConfirmBy)
      : creator;
    task.status = TaskStatus.Reported;
    await task.save();
    return TaskService.filterTaskResponse(task);
  }

  async findAndCount(
    findTaskDto: FindAndCountTaskDto
  ): Promise<FindAndCountTaskResponse> {
    const [tasks, totalTasksCount] = await Task.findAndCount({
      relations: {
        assignedTeam: true,
        assignedUser: true,
        assignedTask: true,
        createdBy: true
      },
      where: [
        {
          name: ILike(`%${findTaskDto.searchTerm}%`),
          status: In(findTaskDto.searchStatus),
          priority: In(findTaskDto.searchPriority),
          assignedTeam: findTaskDto.searchAssignedTeamId
            ? { id: In(findTaskDto.searchAssignedTeamId) }
            : null,
          assignedUser: findTaskDto.searchAssignedUserId
            ? { id: In(findTaskDto.searchAssignedUserId) }
            : null
        },
        {
          description: ILike(`%${findTaskDto.searchTerm}%`),
          status: In(findTaskDto.searchStatus),
          priority: In(findTaskDto.searchPriority),
          assignedTeam: findTaskDto.searchAssignedTeamId
            ? { id: In(findTaskDto.searchAssignedTeamId) }
            : null,
          assignedUser: findTaskDto.searchAssignedUserId
            ? { id: In(findTaskDto.searchAssignedUserId) }
            : null
        }
      ],
      skip: findTaskDto.maxOnPage * (findTaskDto.currentPage - 1),
      take: findTaskDto.maxOnPage
    });
    if (!tasks.length) throw new NotFoundException();

    const totalPages = Math.ceil(totalTasksCount / findTaskDto.maxOnPage);
    return {
      tasks: TaskService.filterManyTasksResponse(tasks),
      totalPages,
      totalTasksCount
    };
  }

  async findOne(id: string): Promise<FindOneTaskResponse> {
    const task = await Task.findOne({
      where: { id },
      relations: {
        comments: true,
        assignedTeam: true,
        assignedUser: true,
        assignedTask: true,
        createdBy: true,
        toBeConfirmBy: true
      }
    });
    if (!task)
      throw new NotFoundException({
        message: {
          task: "task not found"
        }
      });

    task.comments = await this.taskCommentService.findMany(
      task.comments.map((comment) => comment.id)
    );
    return TaskService.filterTaskResponse(task);
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto
  ): Promise<UpdateTaskResponse> {
    const task = await Task.findOne({
      where: { id },
      relations: {
        comments: true,
        assignedTeam: true,
        assignedUser: true,
        assignedTask: true,
        createdBy: true,
        toBeConfirmBy: true
      }
    });
    assignProperties(updateTaskDto, task);
    if (updateTaskDto.assignedTeam)
      task.assignedTeam = await this.teamService.findMany(
        updateTaskDto.assignedTeam
      );
    if (updateTaskDto.assignedUser)
      task.assignedUser = await this.userService.findMany(
        updateTaskDto.assignedUser
      );
    if (updateTaskDto.assignedTask)
      task.assignedTask = await this.findMany(updateTaskDto.assignedTask);
    if (updateTaskDto.toBeConfirmBy)
      task.toBeConfirmBy = (
        await this.userService.findMany([updateTaskDto.toBeConfirmBy])
      )[0];

    await task.save();
    return TaskService.filterTaskResponse(task);
  }

  async remove(id: string): Promise<RemoveTaskResponse> {
    const task = await Task.findOne({
      where: { id },
      relations: {
        assignedTeam: true,
        assignedUser: true,
        assignedTask: true,
        comments: true,
        createdBy: true,
        toBeConfirmBy: true
      }
    });
    if (!task)
      throw new NotFoundException({
        message: {
          task: "task not found"
        }
      });
    nullProperties(task, new TaskRelations());
    await task.save();
    await task.remove();
    return { id };
  }

  async findMany(idArray: string[] | undefined | null): Promise<Task[]> {
    return idArray
      ? await Task.find({
        where: { id: In(idArray) }
      })
      : null;
  }

  async findOneBlank(id: string): Promise<Task> {
    const task = await Task.findOneBy({ id });
    if (!task)
      throw new NotFoundException({
        message: {
          task: "task not found"
        }
      });

    return task;
  }
}
