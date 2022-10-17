import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/task/create.task.dto";
import {
  AssignedTaskHistory,
  AssignedTaskResponse,
  AssignedTaskSeen,
  CreateTaskResponse,
  FindAndCountTaskResponse,
  FindOneTaskResponse,
  FindViewsAndHistoryResponse,
  ManyTasksResponse,
  RemoveTaskResponse,
  TaskHistoryAction,
  TaskRelations,
  TaskResponse,
  TaskStatus,
  UpdateTaskResponse
} from "../types";
import { Task } from "./entities/task.entity";
import { assignProperties, nullProperties } from "../utils/accessory-functions";
import { FindAndCountTaskDto } from "./dto/task/find-and-count.task.dto";
import { ILike, In } from "typeorm";
import { UserService } from "../user/user.service";
import { TeamService } from "../team/team.service";
import { UpdateTaskDto } from "./dto/task/update.task.dto";
import { TaskCommentService } from "./task-comment.service";
import { TaskHistory } from "./entities/task-history.entity";
import { User } from "../user/entities/user.entity";
import { TaskSeen } from "./entities/task-seen.entity";
import { TaskWorkTimeResponse } from "../types/task/task-work-time";
import { TaskWorkTimeService } from "./task-work-time.service";

@Injectable()
export class TaskService {
  constructor(
    @Inject(forwardRef(() => TaskCommentService))
    private taskCommentService: TaskCommentService,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(forwardRef(() => TeamService)) private teamService: TeamService,
    @Inject(forwardRef(() => TaskWorkTimeService))
    private taskWorkTimeService: TaskWorkTimeService
  ) {
  }

  static filterAssignedTaskResponse(
    assignedTask: Task[]
  ): AssignedTaskResponse {
    return assignedTask.map((assignedTask) => {
      return {
        id: assignedTask.id,
        name: assignedTask.name,
        description: assignedTask.description,
        status: assignedTask.status,
        priority: assignedTask.priority,
        createdAt: assignedTask.createdAt
      };
    });
  }

  async create(
    createTaskDto: CreateTaskDto,
    user: User
  ): Promise<CreateTaskResponse> {
    const task = new Task();
    assignProperties(createTaskDto, task);
    task.assignedTeam = await this.teamService.findMany(
      createTaskDto.assignedTeam
    );
    task.assignedUser = await this.userService.findMany(
      createTaskDto.assignedUser
    );
    task.assignedTask = await this.findMany(createTaskDto.assignedTask);
    task.createdBy = user;
    task.toBeConfirmBy = createTaskDto.toBeConfirmBy
      ? await this.userService.findOneBlank(createTaskDto.toBeConfirmBy)
      : user;
    task.status = TaskStatus.Reported;
    await task.save();

    const taskHistory = new TaskHistory();
    taskHistory.action = TaskHistoryAction.Created;
    taskHistory.user = user;
    taskHistory.task = task;
    await taskHistory.save();

    return this.filterTaskResponse(task);
  }

  async findAndCount(
    findTaskDto: FindAndCountTaskDto
  ): Promise<FindAndCountTaskResponse> {
    const [tasks, totalTasksCount] = await Task.findAndCount({
      relations: {
        assignedTeam: true,
        assignedUser: { assignedTeam: true },
        assignedTask: true,
        createdBy: true
      },
      where: [
        {
          name: ILike(`%${findTaskDto.searchTerm}%`),
          status: In(findTaskDto.searchStatus),
          priority: In(findTaskDto.searchPriority),
          assignedTeam: findTaskDto.searchAssignedTeamId
            ? { id: In(findTaskDto.searchAssignedTeamId) }
            : null,
          assignedUser: findTaskDto.searchAssignedUserId
            ? { id: In(findTaskDto.searchAssignedUserId) }
            : null
        },
        {
          description: ILike(`%${findTaskDto.searchTerm}%`),
          status: In(findTaskDto.searchStatus),
          priority: In(findTaskDto.searchPriority),
          assignedTeam: findTaskDto.searchAssignedTeamId
            ? { id: In(findTaskDto.searchAssignedTeamId) }
            : null,
          assignedUser: findTaskDto.searchAssignedUserId
            ? { id: In(findTaskDto.searchAssignedUserId) }
            : null
        }
      ],
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        priority: true,
        createdAt: true,
        assignedTeam: { id: true, name: true },
        assignedUser: {
          id: true,
          name: true,
          surname: true,
          assignedTeam: { id: true, name: true }
        },
        createdBy: {
          id: true,
          name: true,
          surname: true,
          assignedTeam: { id: true, name: true }
        }
      },
      skip: findTaskDto.maxOnPage * (findTaskDto.currentPage - 1),
      take: findTaskDto.maxOnPage
    });
    if (!tasks.length) throw new NotFoundException();

    const totalPages = Math.ceil(totalTasksCount / findTaskDto.maxOnPage);
    return {
      tasks: this.filterManyTasksResponse(tasks),
      totalPages,
      totalTasksCount
    };
  }

  async findOne(id: string, user: User): Promise<FindOneTaskResponse> {
    const task = await Task.findOne({
      where: { id },
      relations: {
        comments: { createdBy: true },
        assignedTeam: true,
        assignedUser: { assignedTeam: true },
        assignedTask: true,
        createdBy: { assignedTeam: true },
        toBeConfirmBy: { assignedTeam: true },
        taskSeen: { user: true },
        taskWorkTime: { user: { assignedTeam: true } }
      },
      order: { taskWorkTime: { changedAt: "ASC", user: { id: "ASC" } } }
    });
    if (!task)
      throw new NotFoundException({
        message: {
          task: "task not found"
        }
      });

    if (
      task.taskSeen.length === 0 ||
      task.taskSeen.some((oneTaskSeen) => oneTaskSeen.user.id !== user.id)
    ) {
      const taskSeen = new TaskSeen();
      taskSeen.user = user;
      taskSeen.task = task;
      await taskSeen.save();
    }

    return this.filterTaskResponse(
      task,
      this.taskWorkTimeService.mapTaskWorkTime(task.taskWorkTime)
    );
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user
  ): Promise<UpdateTaskResponse> {
    const task = await Task.findOne({
      where: { id },
      relations: {
        comments: { createdBy: true },
        assignedTeam: true,
        assignedUser: { assignedTeam: true },
        assignedTask: true,
        createdBy: { assignedTeam: true },
        toBeConfirmBy: { assignedTeam: true },
        taskWorkTime: { user: { assignedTeam: true } }
      }
    });
    let changed = assignProperties(updateTaskDto, task);

    if (updateTaskDto.assignedTeam) {
      task.assignedTeam = await this.teamService.findMany(
        updateTaskDto.assignedTeam
      );
      changed = true;
    }

    if (updateTaskDto.assignedTask) {
      task.assignedTask = await this.findMany(updateTaskDto.assignedTask);
      changed = true;
    }

    if (updateTaskDto.toBeConfirmBy) {
      task.toBeConfirmBy = await this.userService.findOneBlank(
        updateTaskDto.toBeConfirmBy
      );
      changed = true;
    }

    if (updateTaskDto.assignedUser) {
      task.assignedUser = await this.userService.findMany(
        updateTaskDto.assignedUser
      );
      changed = true;
    }

    await task.save();

    if (changed) {
      const taskHistory = new TaskHistory();
      taskHistory.action = TaskHistoryAction.Edited;
      taskHistory.user = user;
      taskHistory.task = task;
      await taskHistory.save();
    }
    if (updateTaskDto.status && updateTaskDto.status !== task.status) {
      const taskHistory = new TaskHistory();
      taskHistory.action = TaskHistoryAction.StatusChanged;
      taskHistory.user = user;
      taskHistory.task = task;
      await taskHistory.save();
    }

    return this.filterTaskResponse(
      task,
      this.taskWorkTimeService.mapTaskWorkTime(task.taskWorkTime)
    );
  }

  async remove(id: string): Promise<RemoveTaskResponse> {
    const task = await Task.findOne({
      where: { id },
      relations: {
        assignedTeam: true,
        assignedUser: true,
        assignedTask: true,
        comments: true,
        createdBy: true,
        toBeConfirmBy: true,
        taskSeen: true,
        taskHistory: true,
        taskWorkTime: true
      }
    });
    if (!task)
      throw new NotFoundException({
        message: {
          task: "task not found"
        }
      });
    nullProperties(task, new TaskRelations());
    await task.save();
    await task.remove();
    return { id };
  }

  async findViewsAndHistory(id: string): Promise<FindViewsAndHistoryResponse> {
    const task = await Task.findOne({
      where: { id },
      relations: {
        taskSeen: { user: { assignedTeam: true } },
        taskHistory: { user: { assignedTeam: true } }
      },
      order: {
        taskHistory: { date: "ASC" },
        taskSeen: { date: "ASC" }
      },
      select: {
        taskHistory: {
          id: true,
          date: true,
          action: true,
          user: {
            id: true,
            name: true,
            surname: true,
            assignedTeam: { id: true, name: true }
          }
        },
        taskSeen: {
          id: true,
          date: true,
          user: {
            id: true,
            name: true,
            surname: true,
            assignedTeam: { id: true, name: true }
          }
        }
      }
    });
    if (!task)
      throw new NotFoundException({
        message: {
          task: "task not found"
        }
      });
    return {
      assignedTaskHistory: this.filterTaskHistoryResponse(task.taskHistory),
      assignedTaskSeen: this.filterTaskSeenResponse(task.taskSeen)
    };
  }

  async findMany(idArray: string[] | undefined | null): Promise<Task[]> {
    return idArray
      ? await Task.find({
        where: { id: In(idArray) }
      })
      : null;
  }

  async findOneBlank(id: string): Promise<Task> {
    const task = await Task.findOne({ where: { id }, select: { id: true } });
    if (!task)
      throw new NotFoundException({
        message: {
          task: "task not found"
        }
      });

    return task;
  }

  private filterTaskResponse(
    task: Task,
    taskWorkTime: TaskWorkTimeResponse = []
  ): TaskResponse {
    return {
      assignedTask: TaskService.filterAssignedTaskResponse(task.assignedTask),
      changedAt: task.changedAt,
      comments: this.taskCommentService.filterAssignedTaskComment(
        task.comments
      ),
      createdBy: this.userService.filterAssignedUserResponse([task.createdBy]),
      toBeConfirmBy: this.userService.filterAssignedUserResponse([
        task.toBeConfirmBy
      ]),
      id: task.id,
      name: task.name,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignedTeam: this.teamService.filterAssignedTeamResponse(
        task.assignedTeam
      ),
      assignedUser: this.userService.filterAssignedUserResponse(
        task.assignedUser
      ),
      createdAt: task.createdAt,
      taskWorkTime
    };
  }

  private filterManyTasksResponse(tasks: Task[]): ManyTasksResponse {
    return tasks?.map((task) => {
      return {
        assignedTeam: this.teamService.filterAssignedTeamResponse(
          task.assignedTeam
        ),
        assignedUser: this.userService.filterAssignedUserResponse(
          task.assignedUser
        ),
        createdAt: task.createdAt,
        description: task.description,
        id: task.id,
        name: task.name,
        priority: task.priority,
        status: task.status
      };
    });
  }

  private filterTaskSeenResponse(taskSeen: TaskSeen[]): AssignedTaskSeen[] {
    return taskSeen.map((oneTaskSeen) => {
      return {
        id: oneTaskSeen.id,
        date: oneTaskSeen.date,
        user: this.userService.filterAssignedUserResponse([
          oneTaskSeen.user
        ])[0]
      };
    });
  }

  private filterTaskHistoryResponse(
    taskHistory: TaskHistory[]
  ): AssignedTaskHistory[] {
    return taskHistory.map((oneTaskHistory) => {
      return {
        id: oneTaskHistory.id,
        action: oneTaskHistory.action,
        date: oneTaskHistory.date,
        user: this.userService.filterAssignedUserResponse([
          oneTaskHistory.user
        ])[0]
      };
    });
  }
}
