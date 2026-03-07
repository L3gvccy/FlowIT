import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [AuthModule, UserModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
