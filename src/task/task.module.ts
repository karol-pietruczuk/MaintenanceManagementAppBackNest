import { forwardRef, Module } from "@nestjs/common";
import { TaskService } from "./task.service";
import { TaskController } from "./task.controller";
import { UserModule } from "../user/user.module";
import { TeamModule } from "../team/team.module";
import { TaskCommentService } from "./task-comment.service";
import { TaskCommentController } from "./task-comment.controller";

@Module({
  imports: [forwardRef(() => UserModule), forwardRef(() => TeamModule)],
  controllers: [TaskController, TaskCommentController],
  providers: [TaskService, TaskCommentService],
  exports: [TaskService]
})
export class TaskModule {
}
