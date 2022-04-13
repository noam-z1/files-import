import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { AuthController } from './auth.controller';
import { AuthRepo } from './auth.repo';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepo, JwtStrategy],
})
export class AuthModule {}
