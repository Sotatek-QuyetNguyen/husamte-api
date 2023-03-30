import { Module } from '@nestjs/common';
import { SocketService } from 'src/share/socket/socket.service';
import { AuthModule } from './auth';
import { PropertyModule } from './property/property.module';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    UserModule,
    PropertyModule,
    AuthModule,
  ],
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
