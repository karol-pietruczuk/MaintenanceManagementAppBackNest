import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { In } from "typeorm";
import { User } from "./entities/user.entity";
import {
  CreateUserResponse,
  FindAllUserResponse,
  FindOneUserResponse,
  RemoveUserResponse,
  UpdateUserResponse
} from "../types/user";
import { assignProperties } from "../utils/accessory-functions";
import { TeamService } from "../team/team.service";
import { hashPwd } from "../utils/hash-pwd";

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => TeamService)) private teamService: TeamService
  ) {
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
    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      roles: user.roles,
      phoneNumber: user.phoneNumber,
      assignedTeam: user.assignedTeam
    };
  }

  async findAll(): Promise<FindAllUserResponse> {
    const users = await User.find();
    return users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        roles: user.roles,
        assignedTeam: user.assignedTeam
      };
    }) as FindAllUserResponse;
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
    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      roles: user.roles,
      phoneNumber: user.phoneNumber,
      assignedTeam: user.assignedTeam,
      assignedTask: user.assignedTask
    };
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

    if (
      updateUserDto.email &&
      user.email !== updateUserDto.email &&
      (await User.findOneBy({ email: updateUserDto.email }))
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
    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      roles: user.roles,
      phoneNumber: user.phoneNumber,
      assignedTeam: user.assignedTeam
    };
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
    user.assignedTask = null;
    user.assignedTeam = null;
    await user.save();
    await user.remove();
    return {
      id
    };
  }

  async findMany(idArray: string[] | undefined | null): Promise<User[]> {
    return idArray
      ? await User.find({
        where: { id: In(idArray) }
      })
      : null;
  }

  async findOneBlank(id: string): Promise<User> {
    const user = await User.findOneBy({ id });
    if (!user)
      throw new NotFoundException({
        message: {
          user: "user not found"
        }
      });

    return user;
  }
}
