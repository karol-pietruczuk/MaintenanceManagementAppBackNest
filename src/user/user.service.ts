import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { In } from "typeorm";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    return "This action adds a new user";
  }

  findAll() {
    return `This action returns all user`;
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
}
