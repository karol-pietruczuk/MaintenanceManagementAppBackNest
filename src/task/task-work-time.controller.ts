import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { TaskWorkTimeService } from "./task-work-time.service";
import { CreateTaskWorkTimeDto } from "./dto/task-work-time/create.task-work-time.dto";
import { Roles } from "../decorators/roles.decorator";
import { UserRole } from "../types/user";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../guards/roles.guard";
import { CreateTaskWorkTimeResponse } from "../types/task/task-work-time";
import { UserObj } from "../decorators/user-obj.decorator";
import { User } from "../user/entities/user.entity";

@Controller("task")
export class TaskWorkTimeController {
  constructor(private readonly taskWorkTimeService: TaskWorkTimeService) {
  }

  @Roles(...Object.values(UserRole))
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Post("work-time")
  create(
    @Body() createTaskWorkTimeDto: CreateTaskWorkTimeDto,
    @UserObj() user: User
  ): Promise<CreateTaskWorkTimeResponse> {
    return this.taskWorkTimeService.create(createTaskWorkTimeDto, user);
  }
}
