import { Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "../user/entities/user.entity";
import { secretToken } from "../config/config";

export interface JwtPayload {
  id: string;
}

function cookieExtractor(req: any): null | string {
  return req && req.cookies ? req.cookies?.jwt ?? null : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: secretToken
    });
  }

  async validate(
    payload: JwtPayload,
    done: (error, user) => void,
    execution: ExecutionContext
  ) {
    console.log(payload);
    console.log(execution);
    if (!payload || !payload.id) {
      return done(new UnauthorizedException(), false);
    }
    const user = await User.findOne({
      where: {
        currentToken: payload.id
      }
    });
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    done(null, user);
  }
}
