import { forwardRef, Module } from "@nestjs/common";
import { TaskService } from "./task.service";
import { TaskController } from "./task.controller";
import { UserModule } from "../user/user.module";
import { TeamModule } from "../team/team.module";
import { TaskCommentService } from "./task-comment.service";
import { TaskCommentController } from "./task-comment.controller";
import { TaskWorkTimeService } from "./task-work-time.service";
import { TaskWorkTimeController } from "./task-work-time.controller";

@Module({
  imports: [forwardRef(() => UserModule), forwardRef(() => TeamModule)],
  controllers: [TaskController, TaskCommentController, TaskWorkTimeController],
  providers: [TaskService, TaskCommentService, TaskWorkTimeService],
  exports: [TaskService]
})
export class TaskModule {
}
