import { Injectable } from "@nestjs/common";
import { Response } from "express";
import { User } from "../user/entities/user.entity";
import { hashPwd } from "../utils/hash-pwd";
import { JwtPayload } from "./jwt.strategy";
import { sign, verify } from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { LoginAuthDto } from "./dto/login.auth.dto";
import { cookieConfig, secretToken } from "../config/config";

interface IdTokensInterface {
  accessTokenId: string;
  refreshTokenId: string;
}

@Injectable()
export class AuthService {
  private static async createTokens(
    { accessTokenId, refreshTokenId }: IdTokensInterface,
    user: User
  ): Promise<{
    accessToken: string;
    accessTokenExpiresIn: number;
    refreshToken: string;
    refreshTokenExpiresIn: number;
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

    user.accessToken = accessTokenId;
    user.refreshToken = refreshTokenId;

    user.accessTokenExpire = new Date(
      new Date().getTime() + accessTokenExpiresIn * 1000
    );
    user.refreshTokenTokenExpire = new Date(
      new Date().getTime() + refreshTokenExpiresIn * 1000
    );

    await user.save();

    return {
      accessToken,
      accessTokenExpiresIn,
      refreshToken,
      refreshTokenExpiresIn
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

  async login(loginAuthDto: LoginAuthDto, res: Response): Promise<Response> {
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

      const token = await AuthService.createTokens(
        await AuthService.generateTokens(),
        user
      );

      return res
        .cookie("jwt", token.accessToken, cookieConfig)
        .status(201)
        .json({ jwt: token.refreshToken });
    } catch (e) {
      return res.status(500).json({ message: { error: e.message } });
    }
  }

  async logout(user: User, res: Response): Promise<Response> {
    try {
      user.accessToken = null;
      user.refreshToken = null;
      await user.save();
      res.clearCookie("jwt", cookieConfig);
      return res.status(200).json();
    } catch (e) {
      return res.status(500).json({ message: { error: e.message } });
    }
  }

  async refresh(jwt: string, res: Response): Promise<Response> {
    try {
      const refreshToken = (verify(jwt, secretToken) as JwtPayload).id;
      let user = await User.findOneBy({
        refreshToken
      });
      if (!user) {
        user = await User.findOneBy({
          accessToken: jwt
        });
        if (user) {
          user.accessToken = null;
          user.refreshToken = null;
          await user.save();
        }
        return res
          .clearCookie("jwt", cookieConfig)
          .status(401)
          .json({ message: { unauthorized: "access denied" } });
      }
      const token = await AuthService.createTokens(
        await AuthService.generateTokens(),
        user
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
