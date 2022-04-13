import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage} from 'multer';
import { FilesService } from './files.service';

@Controller('/files')
export class FilesController {
  constructor(
    private filesService: FilesService,
  ) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'patients', maxCount: 1 },
      { name: 'treatments', maxCount: 1 },
    ], {
      storage: diskStorage({
            destination: './files',
            filename: (req, file, callback) => {
              // ToDo: change to token
              const hospitalId = req.headers.hospitalid;
              const date = new Date().toISOString().slice(0, 10);
              callback(null, `${hospitalId}.${file.fieldname}.${date}.csv`);
            }
          })
    })

  )
  async uploadFile(
    @Body() body: any,
    @UploadedFiles() files: {patients: Express.Multer.File[], treatments: Express.Multer.File[]},
    ) {
      Object.keys(files).forEach(category => {
        files[category].forEach((file) => {
          this.filesService.parseFile(file);
        })
      })
  }
}
