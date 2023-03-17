import { Channel, ConsumeMessage } from "amqplib";
import { ConfigService } from '@nestjs/config';
import { Store } from "./store";
import { TimeUtils } from "src/share/utils/time.utils";

export abstract class BaseHandle {
  protected channel: Channel;
  protected queueName: string;
  protected numberMessageLimit: number = 1;
  protected configService: ConfigService;
  constructor(configService: ConfigService) {
    this.configService = configService;
  }

  async loadChannel() {
    this.channel = await Store.getChannel(this.queueName, this.configService);
  }

  async customerListen() {
    console.log('customer listen: ', this.numberMessageLimit, this.queueName);
    this.channel.prefetch(this.numberMessageLimit, false);
    this.channel.consume(this.queueName, (msg) => {
      this.handle(msg, this);
    }, { noAck: false });
  }

  async listen(): Promise<void> {
    await this.loadChannel();
    this.channel.on('error', () => {
      Store.removeQueue(this.queueName);
      console.log('Channel error');
      try {
        this.channel.close();
      } catch (error) {

      }
    });
    this.channel.on('close', async () => {
      Store.removeQueue(this.queueName);
      console.log('Channel close');
      await TimeUtils.sleep(Math.round(Math.random() * 3000 + 3000));
      try {
        this.listen();
      } catch (error) { }
    });
    try {
      await this.customerListen();
    } catch (error) {
      console.log('assert queue at exchange', error);
    }
  }

  async handle(message: ConsumeMessage, sefl: BaseHandle): Promise<void> {
    const msg = await sefl.parse(message);
    if (msg == null) {
      return;
    }
    try {
      await sefl.process(msg);
      await sefl.handleSuccess(msg, message, sefl);
    } catch (error) {
      sefl.handleError(msg, message, sefl, error);
    }
  }

  async parse(message: ConsumeMessage): Promise<any> {
    try {
      return JSON.parse(message.content.toString());
    } catch (error) {
      //send to parse json error
      const channel = await Store.getChannel('parse-json-error', this.configService);
      channel.sendToQueue('parse-json-error', message.content);
      this.channel.ack(message);
      return null;
    }
  }


  abstract process(message: any): Promise<void>;
  async handleError(msg: any, message: ConsumeMessage, sefl: BaseHandle, error: any) {
    console.log('has error, ', error);
    try {
      await Store.sendToQueue(msg.queueCallbackName, Buffer.from(JSON.stringify({
        _id: msg._id,
        status: 2,
        message: error.message || error,
      })), this.configService);
    } catch (error) {

    }
    // sefl.channel.cancel(message.fields.consumerTag)
    sefl.channel.ack(message);
  }

  async handleSuccess(msg: any, message: ConsumeMessage, sefl: BaseHandle) {
    try {
      await Store.sendToQueue(msg.queueCallbackName, Buffer.from(JSON.stringify({
        _id: msg._id,
        status: 3,
      })), this.configService);
    } catch (error) {

    }
    try {
      sefl.channel.ack(message);
    } catch (error) {

    }
  }
}
