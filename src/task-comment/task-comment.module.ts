import { forwardRef, Module } from "@nestjs/common";
import { TaskCommentService } from "./task-comment.service";
import { TaskCommentController } from "./task-comment.controller";
import { TaskModule } from "../task/task.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [forwardRef(() => TaskModule), UserModule],
  controllers: [TaskCommentController],
  providers: [TaskCommentService],
  exports: [TaskCommentService]
})
export class TaskCommentModule {
}
