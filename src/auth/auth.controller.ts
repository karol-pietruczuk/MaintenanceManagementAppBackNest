import { Body, Controller, Delete, Post, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { AuthGuard } from "@nestjs/passport";
import { UserObj } from "../decorators/user-obj.decorator";
import { User } from "../user/entities/user.entity";
import { LoginAuthDto } from "./dto/login-auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post()
  async phoneRegister(
    @Body() req: LoginAuthDto,
    @Res() res: Response
  ): Promise<any> {
    return this.authService.login(req, res);
  }

  @Delete()
  @UseGuards(AuthGuard("jwt"))
  async logout(@UserObj() user: User, @Res() res: Response) {
    return this.authService.logout(user, res);
  }
}
