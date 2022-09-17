import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create.task.dto";
import {
  CreateTaskResponse,
  FindAndCountTaskResponse,
  FindOneTaskResponse,
  RemoveTaskResponse,
  TaskStatus,
  UpdateTaskResponse
} from "../types";
import { Task } from "./entities/task.entity";
import { assignProperties } from "../utils/accessory-functions";
import { FindAndCountTaskDto } from "./dto/find-and-count.task.dto";
import { ILike, In } from "typeorm";
import { UserService } from "../user/user.service";
import { TeamService } from "../team/team.service";
import { UpdateTaskDto } from "./dto/update.task.dto";

@Injectable()
export class TaskService {
  @Inject() userService: UserService;
  @Inject() teamService: TeamService;

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
    task.status = TaskStatus.Reported;
    await task.save();
    return task;
  }

  async findAndCount(
    findTaskDto: FindAndCountTaskDto
  ): Promise<FindAndCountTaskResponse> {
    const [tasks, totalTasksCount] = await Task.findAndCount({
      relations: {
        assignedTeam: true,
        assignedUser: true,
        assignedTask: true
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
      tasks,
      totalPages,
      totalTasksCount
    };
  }

  async findOne(id: string): Promise<FindOneTaskResponse> {
    const task = await Task.findOne({
      where: { id },
      relations: {
        comments: true
      }
    });
    if (!task) throw new NotFoundException();
    return task;
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
        assignedTask: true
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
    await task.save();
    return task;
  }

  async remove(id: string): Promise<RemoveTaskResponse> {
    const task = await Task.findOne({
      where: { id },
      relations: {
        assignedTeam: true,
        assignedUser: true,
        assignedTask: true,
        comments: true
      }
    });
    if (!task) throw new NotFoundException();
    task.assignedTeam = null;
    task.assignedUser = null;
    task.assignedTask = null;
    task.comments = null;
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
}
