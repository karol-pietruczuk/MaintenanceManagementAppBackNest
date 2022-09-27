import { Injectable } from "@nestjs/common";
import { Response } from "express";
import { User } from "../user/entities/user.entity";
import { hashPwd } from "../utils/hash-pwd";
import { JwtPayload } from "./jwt.strategy";
import { sign } from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { cookieConfig, secretToken } from "../config/config";

@Injectable()
export class AuthService {
  async login(req: LoginAuthDto, res: Response): Promise<any> {
    try {
      const user = await User.findOne({
        where: {
          email: req.email,
          pwdHash: hashPwd(req.pwd)
        }
      });

      if (!user) {
        return res
          .clearCookie("jwt", cookieConfig)
          .status(401)
          .json({ message: { invalidData: "invalid login data" } });
      }

      const token = await this.createToken(await this.generateToken(user));

      return res
        .cookie("jwt", token.accessToken, cookieConfig)
        .status(201)
        .json({ ok: true });
      // @TODO Add there receiving refresh token
    } catch (e) {
      return res.status(500).json({ message: { error: e.message } });
    }
  }

  async logout(user: User, res: Response) {
    try {
      user.currentToken = null;
      await user.save();
      res.clearCookie("jwt", cookieConfig);
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ message: { error: e.message } });
    }
  }

  private createToken(currentTokenId: string): {
    accessToken: string;
    expiresIn: number;
  } {
    const payload: JwtPayload = { id: currentTokenId };
    const expiresIn = 60 * 60 * 24;
    const accessToken = sign(payload, secretToken, { expiresIn });
    return {
      accessToken,
      expiresIn
    };
  }

  private async generateToken(user: User): Promise<string> {
    let token;
    let userWithThisToken = null;

    do {
      token = uuid();
      userWithThisToken = await User.findOne({
        where: { currentToken: token }
      });
    } while (!!userWithThisToken);
    user.currentToken = token;
    await user.save();

    return token;
  }
}
