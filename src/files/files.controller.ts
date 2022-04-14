import { Controller, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage} from 'multer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FilesService } from './files.service';

@Controller('/files')
export class FilesController {
  constructor(
    private filesService: FilesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'patients', maxCount: 1 },
      { name: 'treatments', maxCount: 1 },
    ], {
      storage: diskStorage({
            destination: `./files`,
            filename: (req, file, callback) => {
              const user = req.user as { hospitalid: string }
              const hospitalId = user.hospitalid;
              const date = new Date().toISOString().slice(0, 10);
              callback(null, `${hospitalId}.${file.fieldname}.${date}.csv`);
            }
          })
    })

  )
  async uploadFile(
    @UploadedFiles() files: {patients: Express.Multer.File[], treatments: Express.Multer.File[]},
    @Req() request,
    ) {
      Object.keys(files).forEach(category => {
        files[category].forEach((file) => {
          this.filesService.parseFile(file, request.user.hospitalId);
        })
      })
  }
}
