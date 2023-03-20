import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CrawlerConfigService } from "src/share/configs/config.service";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
@Module({
  imports: [
  ],
  controllers: [UserController],
  providers: [ConfigService, CrawlerConfigService, UserService],
})
export class UserModule {
}
