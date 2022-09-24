import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { BadRequestException, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        console.log(errors);
        const message = {};
        errors.forEach((error) => {
          message[error.property] = Object.values(error.constraints)[0];
        });
        return new BadRequestException({ message });
      },
    }),
  );

  await app.listen(3001);
}
bootstrap();
