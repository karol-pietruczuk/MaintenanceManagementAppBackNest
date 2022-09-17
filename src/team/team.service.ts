import { Injectable } from "@nestjs/common";
import { CreateTeamDto } from "./dto/create-team.dto";
import { UpdateTeamDto } from "./dto/update-team.dto";
import { In } from "typeorm";
import { Team } from "./entities/team.entity";

@Injectable()
export class TeamService {
  create(createTeamDto: CreateTeamDto) {
    return "This action adds a new team";
  }

  findAll() {
    return `This action returns all team`;
  }

  findOne(id: number) {
    return `This action returns a #${id} team`;
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    return `This action updates a #${id} team`;
  }

  remove(id: number) {
    return `This action removes a #${id} team`;
  }

  async findMany(idArray: string[] | undefined | null): Promise<Team[]> {
    return idArray
      ? await Team.find({
        where: { id: In(idArray) }
      })
      : null;
  }
}
