import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HospitalsModule } from './hospitals/hospitals.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [FilesModule, HospitalsModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
