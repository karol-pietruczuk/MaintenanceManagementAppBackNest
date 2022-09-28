import { Body, Controller, Delete, Post, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { AuthGuard } from "@nestjs/passport";
import { UserObj } from "../decorators/user-obj.decorator";
import { User } from "../user/entities/user.entity";
import { LoginAuthDto } from "./dto/login.auth.dto";
import { UserRole } from "../types/user";
import { Roles } from "../decorators/roles.decorator";
import { RolesGuard } from "../guards/roles.guard";
import { RefreshAuthDto } from "./dto/refresh.auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post()
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Res() res: Response
  ): Promise<Response> {
    return this.authService.login(loginAuthDto, res);
  }

  @Delete()
  @Roles(...Object.values(UserRole)) //@TODO Do usunięcia
  @UseGuards(AuthGuard("jwt"), RolesGuard) //@TODO Do usunięcia
  async logout(@UserObj() user: User, @Res() res: Response): Promise<Response> {
    return this.authService.logout(user, res);
  }

  @Post("refresh")
  async refresh(
    @Body() { jwt }: RefreshAuthDto,
    @Res() res: Response
  ): Promise<Response> {
    return this.authService.refresh(jwt, res);
  }
}
