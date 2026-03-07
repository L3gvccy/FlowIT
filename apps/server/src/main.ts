import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import passport from "passport";
import "dotenv/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.use(passport.initialize());
  app.enableCors({
    origin: [process.env.ORIGIN],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Bearer"],
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
