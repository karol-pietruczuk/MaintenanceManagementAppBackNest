import { forwardRef, Module } from "@nestjs/common";
import { TaskService } from "./task.service";
import { TaskController } from "./task.controller";
import { UserModule } from "../user/user.module";
import { TeamModule } from "../team/team.module";
import { TaskCommentService } from "./task-comment.service";

@Module({
  imports: [forwardRef(() => UserModule), forwardRef(() => TeamModule)],
  controllers: [TaskController],
  providers: [TaskService, TaskCommentService],
  exports: [TaskService]
})
export class TaskModule {
}
