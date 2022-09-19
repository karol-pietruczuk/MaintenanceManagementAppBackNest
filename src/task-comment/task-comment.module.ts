import { Module } from "@nestjs/common";
import { TaskCommentService } from "./task-comment.service";
import { TaskCommentController } from "./task-comment.controller";

@Module({
  controllers: [TaskCommentController],
  providers: [TaskCommentService],
  exports: [TaskCommentService]
})
export class TaskCommentModule {
}
