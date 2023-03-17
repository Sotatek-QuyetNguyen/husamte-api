import { Module } from '@nestjs/common';
import { SocketService } from 'src/share/socket/socket.service';
@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class GatewayModule {
  constructor() {
    setTimeout(this.demoSendSocket, 10000);
  }

  demoSendSocket() {
    console.log('emit to dashboard');
    SocketService.emit(['dashboard'], 'events', {
      message: 'hello at ' + Date.now(),
    });
  }
}
