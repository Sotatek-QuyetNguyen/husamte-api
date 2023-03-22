import { Module } from '@nestjs/common';
import { SocketService } from 'src/share/socket/socket.service';
import { AssetProfileModule } from './asset-profile/asset-profile.module';
import { OwnerProfileModule } from './owner-profile/owner-profile.module';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    UserModule,
    AssetProfileModule,
    OwnerProfileModule,
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
