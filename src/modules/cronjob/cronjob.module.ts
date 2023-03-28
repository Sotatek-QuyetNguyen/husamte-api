import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CrawlerConfigService } from 'src/share/configs/config.service';
import { BlockchainEthereumService } from './blockchain.ethereum.service';
@Module({
  imports: [],
  controllers: [],
  providers: [
    ConfigService,
    CrawlerConfigService,
    BlockchainEthereumService,
  ],
})
export class CronjobModule {
  constructor(
    private readonly blockchainEthereumService: BlockchainEthereumService,
  ) {
    setTimeout(() => {
      //this.blockchainEthereumService.run();
      //this.loanService.run();
    });
  }
}
