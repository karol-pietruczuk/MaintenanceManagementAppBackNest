import { Body, Controller, Delete, Param, Patch, Post } from "@nestjs/common";
import { TaskCommentService } from "./task-comment.service";
import { CreateTaskCommentDto } from "./dto/create-task-comment.dto";
import { UpdateTaskCommentDto } from "./dto/update-task-comment.dto";

@Controller("task-comment")
export class TaskCommentController {
  constructor(private readonly taskCommentService: TaskCommentService) {
  }

  @Post()
  create(@Body() createTaskCommentDto: CreateTaskCommentDto) {
    return this.taskCommentService.create(createTaskCommentDto);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateTaskCommentDto: UpdateTaskCommentDto
  ) {
    return this.taskCommentService.update(+id, updateTaskCommentDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.taskCommentService.remove(+id);
  }
}
