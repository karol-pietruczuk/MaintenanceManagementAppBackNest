import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { TaskCommentService } from "./task-comment.service";
import { CreateTaskCommentDto } from "./dto/task-comment/create.task-comment.dto";
import { UpdateTaskCommentDto } from "./dto/task-comment/update.task-comment.dto";
import { CreateTaskCommentResponse, RemoveTaskCommentResponse, UpdateTaskCommentResponse, UserRole } from "../types";
import { Roles } from "../decorators/roles.decorator";
import { RolesGuard } from "../guards/roles.guard";
import { UserObj } from "../decorators/user-obj.decorator";
import { User } from "../user/entities/user.entity";

@Controller("task")
export class TaskCommentController {
  constructor(private readonly taskCommentService: TaskCommentService) {
  }

  @Roles(...Object.values(UserRole))
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Post("comment")
  create(
    @Body() createTaskCommentDto: CreateTaskCommentDto,
    @UserObj() user: User
  ): Promise<CreateTaskCommentResponse> {
    return this.taskCommentService.create(createTaskCommentDto, user);
  }

  @Roles(UserRole.Admin, UserRole.Manager)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Patch("comment/:id")
  update(
    @Param("id") commentId: string,
    @Body() updateTaskCommentDto: UpdateTaskCommentDto
  ): Promise<UpdateTaskCommentResponse> {
    return this.taskCommentService.update(commentId, updateTaskCommentDto);
  }

  @Roles(UserRole.Admin, UserRole.Manager)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Delete("comment/:id")
  remove(@Param("id") id: string): Promise<RemoveTaskCommentResponse> {
    return this.taskCommentService.remove(id);
  }
}
