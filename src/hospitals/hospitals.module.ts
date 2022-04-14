import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { HospitalsController } from './hospitals.controller';
import { HospitalsRepo } from './hospitals.repo';
import { HospitalsService } from './hospitals.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [DatabaseModule],
  controllers: [HospitalsController],
  providers: [HospitalsService, HospitalsRepo, JwtStrategy],
})
export class HospitalsModule {}
