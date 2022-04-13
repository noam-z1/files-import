import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { FilesController } from './files.controller';
import { FilesRepo } from './files.repo';
import { FilesService } from './files.service';

@Module({
  imports: [DatabaseModule],
  controllers: [FilesController],
  providers: [FilesService, FilesRepo],
})
export class FilesModule {}
