import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { In } from "typeorm";
import { User } from "./entities/user.entity";
import { CreateUserResponse, FindAllUserResponse } from "../types/user";
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
      role: user.role,
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
        role: user.role,
        assignedTeam: user.assignedTeam
      };
    }) as FindAllUserResponse;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
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
    if (!user) throw new NotFoundException();

    return user;
  }
}
