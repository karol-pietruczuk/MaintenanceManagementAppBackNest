import { Body, Controller, Delete, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { AuthGuard } from "@nestjs/passport";
import { UserObj } from "../decorators/user-obj.decorator";
import { User } from "../user/entities/user.entity";
import { LoginAuthDto } from "./dto/login.auth.dto";
import { RefreshAuthDto } from "./dto/refresh.auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post()
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Res() res: Response,
    @Req() req: Request
  ): Promise<Response> {
    return this.authService.login(loginAuthDto, res, req);
  }

  @Delete()
  @UseGuards(AuthGuard("jwt"))
  async logout(
    @UserObj() user: User,
    @Res() res: Response,
    @Req() req: Request
  ): Promise<Response> {
    return this.authService.logout(user, res, req);
  }

  @Post("refresh")
  async refresh(
    @Body() { jwt }: RefreshAuthDto,
    @Res() res: Response,
    @Req() req: Request
  ): Promise<Response> {
    return this.authService.refresh(jwt, res, req);
  }
}
