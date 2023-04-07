import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CrawlerConfigService } from "src/share/configs/config.service";
import { CountryController } from "./country.controller";
import { CountryService } from "./country.service";
@Module({
  imports: [
  ],
  controllers: [CountryController],
  providers: [ConfigService, CrawlerConfigService, CountryService],
})
export class CountryModule {}
