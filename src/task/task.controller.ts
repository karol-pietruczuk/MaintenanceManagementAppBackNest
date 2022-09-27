import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { TaskService } from "./task.service";
import { CreateTaskDto } from "./dto/create.task.dto";
import {
  CreateTaskResponse,
  FindAndCountTaskResponse,
  FindOneTaskResponse,
  RemoveTaskResponse,
  UpdateTaskResponse
} from "../types";
import { FindAndCountTaskDto } from "./dto/find-and-count.task.dto";
import { UpdateTaskDto } from "./dto/update.task.dto";
import { Roles } from "../decorators/roles.decorator";
import { UserRole } from "../types/user";
import { RolesGuard } from "../guards/roles.guard";

@Controller("task")
export class TaskController {
  constructor(private readonly taskService: TaskService) {
  }

  @Post("/")
  create(@Body() createTaskDto: CreateTaskDto): Promise<CreateTaskResponse> {
    return this.taskService.create(createTaskDto);
  }

  @Get("/")
  @Roles(UserRole.Technician)
  @UseGuards(RolesGuard)
  findAndCount(
    @Body() findAndCountTaskDto: FindAndCountTaskDto
  ): Promise<FindAndCountTaskResponse> {
    return this.taskService.findAndCount(findAndCountTaskDto);
  }

  @Get("/:id")
  findOne(@Param("id") id: string): Promise<FindOneTaskResponse> {
    return this.taskService.findOne(id);
  }

  @Patch("/:id")
  update(
    @Param("id") id: string,
    @Body() updateTaskDto: UpdateTaskDto
  ): Promise<UpdateTaskResponse> {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete("/:id")
  remove(@Param("id") id: string): Promise<RemoveTaskResponse> {
    return this.taskService.remove(id);
  }
}
