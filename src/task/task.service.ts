import { Injectable } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create.task.dto";
import { createTaskResponse, findAndCountTaskResponse, findOneTaskResponse } from "../types";
import { Task } from "./entities/task.entity";
import { assignProperties } from "../utils/accessory-functions";
import { FindAndCountTaskDto } from "./dto/find-and-count.task.dto";
import { In, Like } from "typeorm";

@Injectable()
export class TaskService {
  async create(createTaskDto: CreateTaskDto): Promise<createTaskResponse> {
    const task = new Task();
    assignProperties(createTaskDto, task);
    await task.save();
    return task;
  }

  async findAndCount(
    findTaskDto: FindAndCountTaskDto
  ): Promise<findAndCountTaskResponse> {
    const [tasks, totalTasksCount] = await Task.findAndCount({
      where: {
        name: Like(`%${findTaskDto.searchTerm}%`),
        status: In(findTaskDto.searchStatus),
        priority: In(findTaskDto.searchPriority),
        assignedTeam: In(findTaskDto.searchAssignedTeam),
        assignedUser: In(findTaskDto.searchAssignedUser)
      },
      skip: findTaskDto.maxOnPage * (findTaskDto.currentPage - 1),
      take: findTaskDto.maxOnPage
    });

    const totalPages = Math.ceil(totalTasksCount / findTaskDto.maxOnPage);
    return {
      tasks,
      totalPages
    };
  }

  async findOne(id: string): Promise<findOneTaskResponse> {
    return await Task.findOne({
      where: { id },
      relations: {
        comments: true
      }
    });
  }

  // async update(
  //   id: string,
  //   updateTaskDto: UpdateTaskDto,
  // ): Promise<updateTaskResponse> {
  //   return `This action updates a #${id} task`;
  // }

  remove(id: string) {
    return `This action removes a #${id} task`;
  }
}
