import { Injectable } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { createTaskResponse } from "../types";
import { Task } from "./entities/task.entity";
import { assignProperties } from "../utils/accessory-functions";

@Injectable()
export class TaskService {
  async create(createTaskDto: CreateTaskDto): Promise<createTaskResponse> {
    const task = new Task();
    assignProperties(createTaskDto, task);
    await task.save();
    return task;
  }

  findAll() {
    return `This action returns all task`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
