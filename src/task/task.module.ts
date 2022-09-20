import { forwardRef, Module } from "@nestjs/common";
import { TaskService } from "./task.service";
import { TaskController } from "./task.controller";
import { UserModule } from "../user/user.module";
import { TeamModule } from "../team/team.module";
import { TaskCommentModule } from "../task-comment/task-comment.module";

@Module({
  imports: [forwardRef(() => TaskCommentModule), UserModule, TeamModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService]
})
export class TaskModule {
}
