import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CrawlerConfigService } from "src/share/configs/config.service";
import { PropertyController } from "./property.controller";
import { PropertyService } from "./property.service";
@Module({
  imports: [
  ],
  controllers: [PropertyController],
  providers: [ConfigService, CrawlerConfigService, PropertyService],
})
export class PropertyModule {
}
