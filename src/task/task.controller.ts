import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { TaskService } from "./task.service";
import { CreateTaskDto } from "./dto/create.task.dto";
import { createTaskResponse, findAndCountTaskResponse, findOneTaskResponse } from "../types";
import { FindAndCountTaskDto } from "./dto/find-and-count.task.dto";

@Controller("task")
export class TaskController {
  constructor(private readonly taskService: TaskService) {
  }

  @Post("/")
  create(@Body() createTaskDto: CreateTaskDto): Promise<createTaskResponse> {
    return this.taskService.create(createTaskDto);
  }

  @Get("/")
  findAndCount(
    @Body() findAndCountTaskDto: FindAndCountTaskDto
  ): Promise<findAndCountTaskResponse> {
    return this.taskService.findAndCount(findAndCountTaskDto);
  }

  @Get("/:id")
  findOne(@Param("id") id: string): Promise<findOneTaskResponse> {
    return this.taskService.findOne(id);
  }

  // @Patch('/:id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateTaskDto: UpdateTaskDto,
  // ): Promise<updateTaskResponse> {
  //   return this.taskService.update(id, updateTaskDto);
  // }

  @Delete("/:id")
  remove(@Param("id") id: string) {
    return this.taskService.remove(id);
  }
}
