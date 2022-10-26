import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { User } from "../user/entities/user.entity";
import { hashPwd } from "../utils/hash-pwd";
import { JwtPayload } from "./jwt.strategy";
import { sign, verify } from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { LoginAuthDto } from "./dto/login.auth.dto";
import { cookieConfig, secretToken } from "../config/config";
import { Like } from "typeorm";
import { nullProperties } from "../utils/accessory-functions";
import { AuthData } from "../types/user";

interface IdTokensInterface {
  accessTokenId: string;
  refreshTokenId: string;
}

@Injectable()
export class AuthService {
  private static cleanAuthData = (
    user: User,
    ip: string,
    userAgent: string
  ) => {
    const lastAuthDataIndex = user.ip.findIndex(
      (oneIp, index) => oneIp === ip && user.userAgent[index] === userAgent
    );

    if (lastAuthDataIndex >= 0) {
      user.accessToken.splice(lastAuthDataIndex, 1);
      user.refreshToken.splice(lastAuthDataIndex, 1);
      user.accessTokenExpire.splice(lastAuthDataIndex, 1);
      user.refreshTokenTokenExpire.splice(lastAuthDataIndex, 1);
      user.ip.splice(lastAuthDataIndex, 1);
      user.userAgent.splice(lastAuthDataIndex, 1);
    }
  };

  private static async generateUserAuthData(
    { accessTokenId, refreshTokenId }: IdTokensInterface,
    user: User,
    req: Request
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const accessTokenPayload: JwtPayload = { id: accessTokenId };
    const refreshTokenPayload: JwtPayload = { id: refreshTokenId };
    const accessTokenExpiresIn = 60 * 60 * 24;
    const refreshTokenExpiresIn = 60 * 60 * 24 * 60;
    const accessToken = sign(accessTokenPayload, secretToken, {
      expiresIn: accessTokenExpiresIn
    });
    const refreshToken = sign(refreshTokenPayload, secretToken, {
      expiresIn: refreshTokenExpiresIn
    });

    const userAgent =
      typeof req.headers["user-agent"] === "string"
        ? req.headers["user-agent"]
        : req.headers["user-agent"][0];

    AuthService.cleanAuthData(user, req.ip, userAgent);

    user.accessToken.push(accessTokenId);
    user.refreshToken.push(refreshTokenId);
    user.accessTokenExpire.push(
      new Date().getTime() + accessTokenExpiresIn * 1000
    );
    user.refreshTokenTokenExpire.push(
      new Date().getTime() + refreshTokenExpiresIn * 1000
    );
    user.ip.push(req.ip);
    user.userAgent.push(userAgent);

    await user.save();

    return {
      accessToken,
      refreshToken
    };
  }

  private static async generateTokens(): Promise<IdTokensInterface> {
    let accessTokenId;
    let refreshTokenId;
    let userWithThisToken = null;

    do {
      accessTokenId = uuid();
      userWithThisToken = await User.findOne({
        where: [
          { accessToken: accessTokenId },
          { refreshToken: accessTokenId }
        ]
      });
    } while (!!userWithThisToken);
    userWithThisToken = null;
    do {
      refreshTokenId = uuid();
      userWithThisToken = await User.findOne({
        where: [
          { accessToken: refreshTokenId },
          { refreshToken: refreshTokenId }
        ]
      });
    } while (!!userWithThisToken);

    return { accessTokenId, refreshTokenId };
  }

  async login(
    loginAuthDto: LoginAuthDto,
    res: Response,
    req: Request
  ): Promise<Response> {
    try {
      const user = await User.findOneBy({
        email: loginAuthDto.email,
        pwdHash: hashPwd(loginAuthDto.pwd)
      });

      if (!user) {
        return res
          .clearCookie("jwt", cookieConfig)
          .status(401)
          .json({ message: { invalidData: "invalid login data" } });
      }

      const token = await AuthService.generateUserAuthData(
        await AuthService.generateTokens(),
        user,
        req
      );

      return res
        .cookie("jwt", token.accessToken, cookieConfig)
        .status(201)
        .json({
          jwt: token.refreshToken,
          user: {
            name: user.name,
            surname: user.surname,
            email: user.email,
            role: user.roles
          }
        });
    } catch (e) {
      return res.status(500).json({ message: { error: e.message } });
    }
  }

  async logout(user: User, res: Response, req: Request): Promise<Response> {
    try {
      AuthService.cleanAuthData(
        user,
        req.ip,
        typeof req.headers["user-agent"] === "string"
          ? req.headers["user-agent"]
          : req.headers["user-agent"][0]
      );
      await user.save();
      res.clearCookie("jwt", cookieConfig);
      return res.status(200).json();
    } catch (e) {
      return res.status(500).json({ message: { error: e.message } });
    }
  }

  async refresh(jwt: string, res: Response, req: Request): Promise<Response> {
    try {
      const refreshToken = (verify(jwt, secretToken) as JwtPayload).id;
      let user = await User.findOneBy({
        refreshToken: Like(`%${refreshToken}%`)
      });
      if (!user) {
        user = await User.findOneBy({
          accessToken: Like(`%${refreshToken}%`)
        });
        if (user) {
          nullProperties(user, new AuthData());
          await user.save();
        }
        return res
          .clearCookie("jwt", cookieConfig)
          .status(401)
          .json({ message: { unauthorized: "access denied" } });
      }
      const token = await AuthService.generateUserAuthData(
        await AuthService.generateTokens(),
        user,
        req
      );

      return res
        .cookie("jwt", token.accessToken, cookieConfig)
        .status(201)
        .json({ jwt: token.refreshToken });
    } catch (e) {
      return res.status(500).json({ message: { error: e.message } });
    }
  }
}
