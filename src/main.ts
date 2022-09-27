import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  (app as NestExpressApplication)
    .use(helmet())
    .use(cookieParser())
    .useGlobalPipes(
      new ValidationPipe({
        disableErrorMessages: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true
        },
        exceptionFactory: (errors) => {
          console.log(errors);
          const message = {};
          errors.forEach((error) => {
            message[error.property] = Object.values(error.constraints)[0];
          });
          return new BadRequestException({ message });
        }
      }),
    );

  await app.listen(3001);
}
bootstrap();
