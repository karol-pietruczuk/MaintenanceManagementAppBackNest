import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { In } from "typeorm";
import { User } from "./entities/user.entity";
import {
  AssignedUserResponse,
  CreateUserResponse,
  FindAllUserResponse,
  FindOneUserResponse,
  ManyUserResponse,
  RemoveUserResponse,
  UpdateUserResponse,
  UserRelations,
  UserResponse
} from "../types";
import { assignProperties, nullProperties } from "../utils/accessory-functions";
import { TeamService } from "../team/team.service";
import { hashPwd } from "../utils/hash-pwd";

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => TeamService)) private teamService: TeamService
  ) {
  }

  filterAssignedUserResponse(users: User[]): AssignedUserResponse {
    return users?.map((user) => {
      return {
        id: user.id,
        name: user.name,
        surname: user.surname,
        assignedTeam: this.teamService.filterAssignedTeamResponse(
          user.assignedTeam
        )
      };
    });
  }

  async create(createUserDto: CreateUserDto): Promise<CreateUserResponse> {
    if (await User.findOneBy({ email: createUserDto.email }))
      throw new ConflictException({
        message: {
          email: "user with given email already exists"
        }
      });
    const user = new User();
    assignProperties(createUserDto, user);
    user.pwdHash = hashPwd(createUserDto.pwd);
    if (createUserDto.assignedTeam)
      user.assignedTeam = await this.teamService.findMany(
        createUserDto.assignedTeam
      );
    await user.save();
    return this.filterUserResponse(user);
  }

  async findAll(): Promise<FindAllUserResponse> {
    const users = await User.find({
      relations: {
        assignedTeam: true
      },
      select: {
        id: true,
        name: true,
        surname: true,
        roles: true,
        assignedTeam: { id: true, name: true }
      }
    });
    return this.filterManyUserResponse(users);
  }

  async findOne(id: string): Promise<FindOneUserResponse> {
    const user = await User.findOne({
      where: { id },
      relations: {
        assignedTeam: true,
        assignedTask: true
      }
    });
    if (!user)
      throw new NotFoundException({
        message: {
          user: "user not found"
        }
      });
    return this.filterUserResponse(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto
  ): Promise<UpdateUserResponse> {
    const user = await User.findOne({
      where: { id },
      relations: {
        assignedTeam: true
      }
    });

    const userWithEmail = await User.findOneBy({ email: updateUserDto.email });
    if (
      updateUserDto.email &&
      user.email !== updateUserDto.email &&
      userWithEmail &&
      userWithEmail.id !== user.id
    )
      throw new ConflictException({
        message: {
          email: "user with given email already exists"
        }
      });

    assignProperties(updateUserDto, user);
    if (updateUserDto.assignedTeam)
      user.assignedTeam = await this.teamService.findMany(
        updateUserDto.assignedTeam
      );
    await user.save();
    return this.filterUserResponse(user);
  }

  async remove(id: string): Promise<RemoveUserResponse> {
    const user = await User.findOne({
      where: { id },
      relations: {
        assignedTeam: true,
        assignedTask: true
      }
    });
    if (!user)
      throw new NotFoundException({
        message: {
          user: "user not found"
        }
      });
    nullProperties(user, new UserRelations());
    await user.save();
    await user.remove();
    return {
      id
    };
  }

  async findMany(idArray: string[] | undefined | null): Promise<User[]> {
    return idArray
      ? await User.find({
        where: { id: In(idArray) },
        relations: { assignedTeam: true },
        select: {
          id: true,
          name: true,
          surname: true,
          assignedTeam: { id: true, name: true }
        }
      })
      : null;
  }

  async findOneBlank(id: string): Promise<User> {
    const user = await User.findOne({
      where: { id },
      relations: { assignedTeam: true }
    });
    if (!user)
      throw new NotFoundException({
        message: {
          user: "user not found"
        }
      });

    return user;
  }

  private filterUserResponse(user: User): UserResponse {
    return {
      assignedTeam: this.teamService.filterAssignedTeamResponse(
        user.assignedTeam
      ),
      email: user.email,
      id: user.id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      roles: user.roles,
      surname: user.surname
    };
  }

  private filterManyUserResponse(users: User[]): ManyUserResponse {
    return users?.map((user) => {
      return {
        id: user.id,
        name: user.name,
        surname: user.surname,
        roles: user.roles,
        assignedTeam: this.teamService.filterAssignedTeamResponse(
          user.assignedTeam
        )
      };
    });
  }
}
