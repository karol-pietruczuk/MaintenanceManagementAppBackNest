import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { TeamService } from "./team.service";
import { CreateTeamDto } from "./dto/create-team.dto";
import { UpdateTeamDto } from "./dto/update-team.dto";
import {
  CreateTeamResponse,
  FindAllTeamResponse,
  FindOneTeamResponse,
  RemoveTeamResponse,
  UpdateTeamResponse
} from "../types/team";

@Controller("team")
export class TeamController {
  constructor(private readonly teamService: TeamService) {
  }

  @Post()
  create(@Body() createTeamDto: CreateTeamDto): Promise<CreateTeamResponse> {
    return this.teamService.create(createTeamDto);
  }

  @Get()
  findAll(): Promise<FindAllTeamResponse> {
    return this.teamService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<FindOneTeamResponse> {
    return this.teamService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateTeamDto: UpdateTeamDto
  ): Promise<UpdateTeamResponse> {
    return this.teamService.update(id, updateTeamDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string): Promise<RemoveTeamResponse> {
    return this.teamService.remove(id);
  }
}
