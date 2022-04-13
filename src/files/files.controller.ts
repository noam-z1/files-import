import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage} from 'multer';

@Controller('/files')
export class FilesController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file'
    // , {
    //   storage: diskStorage({
    //     destination: './files',
    //   })
    // }
    )
  )
  async uploadFile() {
    return 'All good!';
  }
}
