import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { dataSourceOptions } from "./config/config";
import { TaskModule } from "./task/task.module";
import { TeamModule } from "./team/team.module";
import { UserModule } from "./user/user.module";
import { TaskCommentModule } from "./task-comment/task-comment.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    TaskModule,
    TeamModule,
    UserModule,
    TaskCommentModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
