import { Controller, Get } from '@nestjs/common';

@Controller('/files')
export class FilesController {
  @Get()
  healthcheck() {
    console.log('All good!');
    return 'All good!';
  }
}
