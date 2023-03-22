import { BigNumber, Contract, ethers, Signer } from "ethers";
import { ConfigService } from "@nestjs/config";
import { TimeUtils } from "../utils/time.utils";
import { PrismaService } from "../prisma/prisma.service";
import { CrawlerConfigService } from "src/share/configs/config.service";
import { TelegramUtils } from "../utils/telegram.utils";

export abstract class BlockchainBaseService {
  protected chain: string;
  protected ABI: any;
  protected network: ethers.providers.Network;
  public provider: ethers.providers.JsonRpcProvider;
  public account: any;
  protected grpcs: Array<string> = [];
  protected grpcIndex: number = 0;
  // protected contractAddress: string = "";
  protected configService: ConfigService;
  protected crawlerConfigService: CrawlerConfigService;
  protected maxGasPrice: number = 120000000000;
  protected plusNumber: number = 20000000000;
  protected mapContracts: Map<string, Contract> = new Map<string, Contract>();
  protected prisma: PrismaService;
  protected abiCoder: ethers.utils.Interface;
  constructor(
    crawlerConfigService: CrawlerConfigService,
    prisma: PrismaService,
    configService: ConfigService,
  ) {
    this.configService = configService;
    this.crawlerConfigService = crawlerConfigService;
    this.prisma = prisma;
  }
  async init(): Promise<Boolean> {
    await this.loadProvider();
    // const hexPrivateKey = await this.walletService.getByPrivate(this.walletAddress);
    // if (!hexPrivateKey)
    //   return false;
    // const key = this.configService.get('AES_256_KEY', 'sotatek').padEnd(32, '0');
    // const iv = key.toString("hex").slice(0, 16);
    // const decrypter = crypto.createDecipheriv("aes-256-cbc", key, iv);

    // let decryptedMsg = decrypter.update(hexPrivateKey.privateKey, "hex", "utf8");
    // decryptedMsg += decrypter.final("utf8");
    // const wallet = new ethers.Wallet(decryptedMsg);
    // this.account = wallet.connect(this.provider);

    return true;
  }

  async getGasPrice(useLowerNetworkFee?: boolean): Promise<BigNumber> {
    const baseGasPrice = BigNumber.from(await this.provider.getGasPrice());
    let finalGasPrice: BigNumber = BigNumber.from(this.maxGasPrice);

    if (baseGasPrice.gt(finalGasPrice)) {
      finalGasPrice = baseGasPrice;
    } else {
      let mulNumber = 5;
      if (!!useLowerNetworkFee) {
        mulNumber = 2;
      }

      const multiplyGasPrice = baseGasPrice.mul(mulNumber);
      if (finalGasPrice.gt(multiplyGasPrice)) {
        finalGasPrice = multiplyGasPrice;
      }

      const plusGasPrice = baseGasPrice.add(this.plusNumber);
      if (finalGasPrice.gt(plusGasPrice)) {
        finalGasPrice = plusGasPrice;
      }
    }

    return finalGasPrice;
  }

  async getNounce(address: string): Promise<number> {
    while (true) {
      try {
        const nounce = await this.provider.getTransactionCount(address);
        return nounce;
        // const wallet = await this.prisma.wallet.findFirst({ where: { address } });
        // if (wallet.nounce < nounce) {
        //   return (await this.prisma.wallet.update({ where: { id: wallet.id }, data: { nounce } })).nounce;
        // }
        // return (await this.prisma.wallet.update({ where: { address }, data: { nounce: { increment: 1 } } })).nounce;
      } catch (error) {
        TimeUtils.sleep(Math.round(Math.random() * 3000 + 100));
        await this.loadProvider();
      }
    }
  }



  async performStart(id: number): Promise<void> {

  }

  async performFinish(id: number): Promise<void> {

  }

  async getLastNumber(): Promise<number> {
    console.log('load last number of ' + this.chain);
    while (true) {
      try {
        return await this.provider.getBlockNumber();
      } catch (error) {
      }
      console.log('request reload');
      await TimeUtils.sleep(Math.floor(Math.random() * 3000 + 1000));
      try {
        await this.loadProvider();
      } catch (error) {
        console.log('error at load provider', error)
      }
    }
  }

  async loadProvider(): Promise<void> {
    this.grpcs.shift();
    if (!this.grpcs.length) {
      await this.reloadGrpcs();
    }
    if (!this.grpcs.length) {
      TelegramUtils.sendNormalText('', 'error load provider', `grpc of ${this.chain} is empty`);
      return;
    }
    // this.grpcIndex++;
    // if (this.grpcIndex >= this.grpcs.length) {
    //   this.grpcIndex = 0;
    // }
    console.log('load provider: ', this.grpcs[0]);
    let retryCount = 0;
    while (retryCount < 10) {
      try {
        if (this.network)
          this.provider = new ethers.providers.JsonRpcProvider(this.grpcs[0], this.network);
        else {
          this.provider = new ethers.providers.JsonRpcProvider(this.grpcs[0]);
          this.network = await this.provider.getNetwork();
        }
        return;
      } catch (error) {
        retryCount++;
        console.log('cannot init provider: ', error);
        this.network = undefined;
        await TimeUtils.sleep(Math.round(Math.random() * 3000 + 1000));
        if (retryCount > 9) {
          TelegramUtils.sendNormalText('', 'error load provider', error);
        }
      }
    }
    await this.loadProvider();
  }

  async reloadGrpcs(): Promise<void> {
    // const crawlerConfig = await this.getByKey(`${this.chain}-grpcs`);
    // this.grpcs = crawlerConfig.valueString.split(',').map((s) => s.trim());
    const rs = await this.crawlerConfigService.get(undefined, `grpc_of_${this.chain}`);
    if (!rs)
      return;

    this.grpcs = rs.stringValue.split(',').map((s) => s.trim());
  }

}
