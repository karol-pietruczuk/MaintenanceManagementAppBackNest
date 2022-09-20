import { Body, Controller, Delete, Param, Patch, Post } from "@nestjs/common";
import { TaskCommentService } from "./task-comment.service";
import { CreateTaskCommentDto } from "./dto/create-task-comment.dto";
import { UpdateTaskCommentDto } from "./dto/update-task-comment.dto";
import { CreateTaskCommentResponse, RemoveTaskCommentResponse, UpdateTaskCommentResponse } from "../types/task-comment";

@Controller("task-comment")
export class TaskCommentController {
  constructor(private readonly taskCommentService: TaskCommentService) {
  }

  @Post()
  create(
    @Body() createTaskCommentDto: CreateTaskCommentDto
  ): Promise<CreateTaskCommentResponse> {
    return this.taskCommentService.create(createTaskCommentDto);
  }

  @Patch(":id")
  update(
    @Param("id") commentId: string,
    @Body() updateTaskCommentDto: UpdateTaskCommentDto
  ): Promise<UpdateTaskCommentResponse> {
    return this.taskCommentService.update(commentId, updateTaskCommentDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string): Promise<RemoveTaskCommentResponse> {
    return this.taskCommentService.remove(id);
  }
}
