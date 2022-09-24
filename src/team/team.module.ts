import { forwardRef, Module } from "@nestjs/common";
import { TeamService } from "./team.service";
import { TeamController } from "./team.controller";
import { TaskModule } from "../task/task.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [forwardRef(() => TaskModule), forwardRef(() => UserModule)],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService]
})
export class TeamModule {
}
