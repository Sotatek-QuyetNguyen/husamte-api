/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import * as bluebird from 'bluebird';
import {RedisClient, createClient, Multi} from 'redis';

export class CacheService {
  private client: any;

  constructor() {
    bluebird.promisifyAll(RedisClient.prototype);
    bluebird.promisifyAll(Multi.prototype);
    this.client = createClient(process.env['REDIS_URL'] || '');
    this.client.on('error', () => {
      if (this.client) this.client.quit();
    });
  }

  public async setAsync(...params: any[]): Promise<void> {
    return this.client.setAsync(params);
  }

  public async getAsync(...params: any[]): Promise<string | null> {
    return this.client.getAsync(params);
  }

  public async delAsync(...params: any[]): Promise<void> {
    return this.client.delAsync(params);
  }

  public async ttlAsync(...params: any[]): Promise<void> {
    return this.client.ttlAsync(params);
  }
}
