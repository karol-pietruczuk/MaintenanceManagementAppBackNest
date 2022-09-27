import { Body, Controller, Delete, Post, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { AuthGuard } from "@nestjs/passport";
import { UserObj } from "../decorators/user-obj.decorator";
import { User } from "../user/entities/user.entity";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { UserRole } from "../types/user";
import { Roles } from "../decorators/roles.decorator";
import { RolesGuard } from "../guards/roles.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post()
  async login(@Body() req: LoginAuthDto, @Res() res: Response): Promise<any> {
    return this.authService.login(req, res);
  }

  @Delete()
  @Roles(...Object.values(UserRole))
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  async logout(@UserObj() user: User, @Res() res: Response) {
    return this.authService.logout(user, res);
  }
}
