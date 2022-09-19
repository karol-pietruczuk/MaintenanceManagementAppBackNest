import { Injectable } from "@nestjs/common";
import { CreateTaskCommentDto } from "./dto/create-task-comment.dto";
import { UpdateTaskCommentDto } from "./dto/update-task-comment.dto";
import { TaskComment } from "./entities/task-comment.entity";

@Injectable()
export class TaskCommentService {
  create(createTaskCommentDto: CreateTaskCommentDto) {
    return "This action adds a new taskComment";
  }

  findAll() {
    return `This action returns all taskComment`;
  }

  async findOne(id: string) {
    return await TaskComment.findOne({
      where: { id },
      relations: { createdBy: true }
    });
  }

  update(id: number, updateTaskCommentDto: UpdateTaskCommentDto) {
    return `This action updates a #${id} taskComment`;
  }

  remove(id: number) {
    return `This action removes a #${id} taskComment`;
  }
}
