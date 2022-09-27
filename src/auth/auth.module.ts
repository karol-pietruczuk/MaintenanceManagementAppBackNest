import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService],
  exports: [JwtStrategy]
})
export class AuthModule {
}
