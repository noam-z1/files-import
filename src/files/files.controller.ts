import {
  Controller,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/hospitals/guards/jwt-auth.guard';
import { FilesService, fileWithHospitalId } from './files.service';

@Controller('/files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'patients', maxCount: 1 },
        { name: 'treatments', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: `./files`,
          filename: (req, file, callback) => {
            const user = req.user as { hospitalId: string };
            const hospitalId = user.hospitalId;
            const date = new Date().toISOString().slice(0, 10);
            callback(null, `${hospitalId}.${file.fieldname}.${date}.csv`);
          },
        }),
      },
    ),
  )
  async uploadFile(
    @UploadedFiles()
    files: {
      patients: Express.Multer.File[];
      treatments: Express.Multer.File[];
    },
    @Req() request,
  ) {
    Object.keys(files).forEach((category) => {
      files[category].forEach((file: Express.Multer.File) => {
        const fileWithHospitalId: fileWithHospitalId = {
          ...file,
          hospitalId: request.user.hospitalId,
        };
        this.filesService.parseFile(fileWithHospitalId);
      });
    });
  }
}
