import { Module, CacheModule, CacheInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { CommonModule } from 'src/share/common/common.module';

import { AuthSerializer } from './auth.serializer';
import * as controllers from './controllers';
import { JwtAuthGuard } from './guards';
import { AdminGuard } from './guards/admin.guard';
import { AuthService } from './providers/auth.service';
import { LocalStrategy, JwtStrategy } from './strategies';

@Module({
  imports: [
    CommonModule,
    CacheModule.register(),
    
    JwtModule.register({
      secret: 'a',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    JwtAuthGuard,
    AdminGuard,
    AuthService,
    AuthSerializer,
    LocalStrategy,
    JwtStrategy,
    ConfigService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  controllers: Object.values(controllers),
  exports: [AuthService],
})
export class AuthModule {}
