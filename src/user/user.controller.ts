import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import {
  CreateUserResponse,
  FindAllUserResponse,
  FindOneUserResponse,
  RemoveUserResponse,
  UpdateUserResponse,
  UserRole
} from "../types/user";
import { Roles } from "../decorators/roles.decorator";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../guards/roles.guard";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Roles(UserRole.Admin)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<CreateUserResponse> {
    return this.userService.create(createUserDto);
  }

  @Roles(...Object.values(UserRole))
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Get()
  findAll(): Promise<FindAllUserResponse> {
    return this.userService.findAll();
  }

  @Roles(UserRole.Admin, UserRole.Manager)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Get(":id")
  findOne(@Param("id") id: string): Promise<FindOneUserResponse> {
    return this.userService.findOne(id);
  }

  @Roles(UserRole.Admin)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UpdateUserResponse> {
    return this.userService.update(id, updateUserDto);
  }

  @Roles(UserRole.Admin)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Delete(":id")
  remove(@Param("id") id: string): Promise<RemoveUserResponse> {
    return this.userService.remove(id);
  }
}
