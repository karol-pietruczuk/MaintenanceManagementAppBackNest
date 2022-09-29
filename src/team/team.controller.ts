import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
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
import { Roles } from "../decorators/roles.decorator";
import { UserRole } from "../types/user";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../guards/roles.guard";

@Controller("team")
export class TeamController {
  constructor(private readonly teamService: TeamService) {
  }

  @Roles(UserRole.Admin)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Post()
  create(@Body() createTeamDto: CreateTeamDto): Promise<CreateTeamResponse> {
    return this.teamService.create(createTeamDto);
  }

  @Roles(UserRole.Admin, UserRole.Manager)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Get()
  findAll(): Promise<FindAllTeamResponse> {
    return this.teamService.findAll();
  }

  @Roles(UserRole.Admin, UserRole.Manager)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Get(":id")
  findOne(@Param("id") id: string): Promise<FindOneTeamResponse> {
    return this.teamService.findOne(id);
  }

  @Roles(UserRole.Admin)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateTeamDto: UpdateTeamDto
  ): Promise<UpdateTeamResponse> {
    return this.teamService.update(id, updateTeamDto);
  }

  @Roles(UserRole.Admin)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Delete(":id")
  remove(@Param("id") id: string): Promise<RemoveTeamResponse> {
    return this.teamService.remove(id);
  }
}
