import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { TaskCommentService } from "./task-comment.service";
import { CreateTaskCommentDto } from "./dto/create-task-comment.dto";
import { UpdateTaskCommentDto } from "./dto/update-task-comment.dto";
import { CreateTaskCommentResponse, RemoveTaskCommentResponse, UpdateTaskCommentResponse } from "../types/task-comment";
import { Roles } from "../decorators/roles.decorator";
import { UserRole } from "../types/user";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../guards/roles.guard";

@Controller("task-comment")
export class TaskCommentController {
  constructor(private readonly taskCommentService: TaskCommentService) {
  }

  @Roles(...Object.values(UserRole))
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Post()
  create(
    @Body() createTaskCommentDto: CreateTaskCommentDto
  ): Promise<CreateTaskCommentResponse> {
    return this.taskCommentService.create(createTaskCommentDto);
  }

  @Roles(UserRole.Admin, UserRole.Manager)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Patch(":id")
  update(
    @Param("id") commentId: string,
    @Body() updateTaskCommentDto: UpdateTaskCommentDto
  ): Promise<UpdateTaskCommentResponse> {
    return this.taskCommentService.update(commentId, updateTaskCommentDto);
  }

  @Roles(UserRole.Admin, UserRole.Manager)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Delete(":id")
  remove(@Param("id") id: string): Promise<RemoveTaskCommentResponse> {
    return this.taskCommentService.remove(id);
  }
}
