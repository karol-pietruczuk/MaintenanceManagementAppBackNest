import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateTeamDto } from "./dto/create-team.dto";
import { UpdateTeamDto } from "./dto/update-team.dto";
import { In } from "typeorm";
import { Team } from "./entities/team.entity";
import { CreateTeamResponse, FindAllTeamResponse, RemoveTeamResponse, UpdateTeamResponse } from "../types/team";
import { assignProperties } from "../utils/accessory-functions";
import { UserService } from "../user/user.service";
import { TaskService } from "../task/task.service";

@Injectable()
export class TeamService {
  constructor(
    @Inject(forwardRef(() => TaskService)) private taskService: TaskService,
    @Inject(forwardRef(() => UserService)) private userService: UserService
  ) {
  }

  async create(createTeamDto: CreateTeamDto): Promise<CreateTeamResponse> {
    const team = new Team();
    assignProperties(createTeamDto, team);
    team.assignedTask = await this.taskService.findMany(
      createTeamDto.assignedTask
    );
    team.assignedUser = await this.userService.findMany(
      createTeamDto.assignedUser
    );
    await team.save();
    return team;
  }

  async findAll(): Promise<FindAllTeamResponse> {
    return await Team.find();
  }

  async findOne(id: string): Promise<Team> {
    const team = await Team.findOne({
      where: { id },
      relations: { assignedUser: true, assignedTask: true }
    });
    if (!team) throw new NotFoundException();
    return team;
  }

  async update(
    id: string,
    updateTeamDto: UpdateTeamDto
  ): Promise<UpdateTeamResponse> {
    const team = await this.findOne(id);
    assignProperties(updateTeamDto, team);
    if (updateTeamDto.assignedTask)
      team.assignedTask = await this.taskService.findMany(
        updateTeamDto.assignedTask
      );
    if (updateTeamDto.assignedUser)
      team.assignedUser = await this.userService.findMany(
        updateTeamDto.assignedUser
      );
    await team.save();
    return team;
  }

  async remove(id: string): Promise<RemoveTeamResponse> {
    const team = await this.findOne(id);
    team.assignedTask = null;
    team.assignedUser = null;
    await team.save();
    return {
      id
    };
  }

  async findMany(idArray: string[] | undefined | null): Promise<Team[]> {
    return idArray
      ? await Team.find({
        where: { id: In(idArray) }
      })
      : null;
  }
}
