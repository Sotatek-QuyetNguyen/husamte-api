import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CrawlerConfigService } from "src/share/configs/config.service";
import { PropertyController } from "./property.controller";
import { PropertyService } from "./property.service";
import { CommonModule } from "src/share/common/common.module";
@Module({
  imports: [
    CommonModule
  ],
  controllers: [PropertyController],
  providers: [ConfigService, CrawlerConfigService, PropertyService],
})
export class PropertyModule {
}
