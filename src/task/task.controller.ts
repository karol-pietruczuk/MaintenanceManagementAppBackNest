import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { TaskService } from "./task.service";
import { CreateTaskDto } from "./dto/task/create.task.dto";
import {
  CreateTaskResponse,
  FindAndCountTaskResponse,
  FindOneTaskResponse,
  FindViewsAndHistoryResponse,
  RemoveTaskResponse,
  UpdateTaskResponse
} from "../types";
import { FindAndCountTaskDto } from "./dto/task/find-and-count.task.dto";
import { UpdateTaskDto } from "./dto/task/update.task.dto";
import { Roles } from "../decorators/roles.decorator";
import { UserRole } from "../types/user";
import { RolesGuard } from "../guards/roles.guard";
import { AuthGuard } from "@nestjs/passport";
import { UserObj } from "../decorators/user-obj.decorator";
import { User } from "../user/entities/user.entity";

@Controller("task")
export class TaskController {
  constructor(private readonly taskService: TaskService) {
  }

  @Roles(...Object.values(UserRole))
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Post("/")
  create(
    @Body() createTaskDto: CreateTaskDto,
    @UserObj() user: User
  ): Promise<CreateTaskResponse> {
    return this.taskService.create(createTaskDto, user);
  }

  @Get("/")
  @Roles(...Object.values(UserRole))
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  findAndCount(
    @Body() findAndCountTaskDto: FindAndCountTaskDto
  ): Promise<FindAndCountTaskResponse> {
    return this.taskService.findAndCount(findAndCountTaskDto);
  }

  @Roles(...Object.values(UserRole))
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Get("/:id")
  findOne(
    @Param("id") id: string,
    @UserObj() user: User
  ): Promise<FindOneTaskResponse> {
    return this.taskService.findOne(id, user);
  }

  @Roles(...Object.values(UserRole))
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Patch("/:id")
  update(
    @Param("id") id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @UserObj() user: User
  ): Promise<UpdateTaskResponse> {
    return this.taskService.update(id, updateTaskDto, user);
  }

  @Roles(UserRole.Admin)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Delete("/:id")
  remove(@Param("id") id: string): Promise<RemoveTaskResponse> {
    return this.taskService.remove(id);
  }

  @Roles(...Object.values(UserRole))
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Get("/:id/stats")
  findViewsAndHistory(
    @Param("id") id: string
  ): Promise<FindViewsAndHistoryResponse> {
    return this.taskService.findViewsAndHistory(id);
  }
}
