import { forwardRef, Inject, Injectable, NotAcceptableException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { TeamService } from "../team/team.service";
import { TaskWorkTime } from "./entities/task-work-time.entity";
import { CreateTaskWorkTimeResponse, TaskWorkTimeAction, TaskWorkTimeResponse } from "../types/task/task-work-time";
import { TaskService } from "./task.service";
import { CreateTaskWorkTimeDto } from "./dto/task-work-time/create.task-work-time.dto";
import { User } from "../user/entities/user.entity";

@Injectable()
export class TaskWorkTimeService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(forwardRef(() => TeamService)) private teamService: TeamService,
    @Inject(forwardRef(() => TaskService)) private taskService: TaskService
  ) {
  }

  mapTaskWorkTime(taskWorkTime: TaskWorkTime[]): TaskWorkTimeResponse {
    let workTime = 0;

    return taskWorkTime
      .map((taskWorkTime, index, taskWorkTimeAr) => {
        if (taskWorkTime.action === TaskWorkTimeAction.start) {
          if (taskWorkTimeAr[index + 1]?.user.id === taskWorkTime.user.id) {
            workTime =
              Number(taskWorkTimeAr[index + 1].changedAt) -
              Number(taskWorkTime.changedAt) +
              workTime;
          } else {
            const tempWorkTime = workTime
              ? workTime
              : Number(new Date()) - Number(taskWorkTime.changedAt);
            workTime = 0;
            return {
              isWorking: true,
              workTime: Math.ceil(tempWorkTime / 1000),
              user: {
                id: taskWorkTime.user.id,
                name: taskWorkTime.user.name,
                surname: taskWorkTime.user.surname
              }
            };
          }
        } else if (
          taskWorkTimeAr[index + 1]?.user.id !== taskWorkTime.user.id
        ) {
          const tempWorkTime = workTime;
          workTime = 0;
          return {
            isWorking: false,
            workTime: Math.ceil(tempWorkTime / 1000),
            user: {
              id: taskWorkTime.user.id,
              name: taskWorkTime.user.name,
              surname: taskWorkTime.user.surname
            }
          };
        }
      })
      .filter((taskWorkTimeResponse) => {
        return !!taskWorkTimeResponse;
      });
  }

  async create(
    createTaskWorkTimeDto: CreateTaskWorkTimeDto,
    user: User
  ): Promise<CreateTaskWorkTimeResponse> {
    const task = await this.taskService.findOneBlank(
      createTaskWorkTimeDto.taskId
    );
    const oldTaskWorkTimeAr = await TaskWorkTime.find({
      relations: { user: true },
      where: {
        task: {
          id: createTaskWorkTimeDto.taskId
        },
        user: { id: user.id }
      },
      order: { changedAt: "ASC", user: { id: "ASC" } }
    });

    if (
      oldTaskWorkTimeAr[oldTaskWorkTimeAr.length - 1]?.action ===
      createTaskWorkTimeDto.action
    ) {
      throw new NotAcceptableException({
        message: {
          taskWorkTimeAction: `user's taskWorkTime action is already set to ${createTaskWorkTimeDto.action}`
        }
      });
    }
    if (
      oldTaskWorkTimeAr.length === 0 &&
      createTaskWorkTimeDto.action === TaskWorkTimeAction.stop
    ) {
      throw new NotAcceptableException({
        message: {
          taskWorkTimeAction: `user is not working, so work cannot be stopped`
        }
      });
    }

    const taskWorkTime = new TaskWorkTime();
    taskWorkTime.task = task;
    taskWorkTime.user = user;
    taskWorkTime.action = createTaskWorkTimeDto.action;
    await taskWorkTime.save();
    oldTaskWorkTimeAr.push(taskWorkTime);
    return this.mapTaskWorkTime(oldTaskWorkTimeAr);
  }
}
