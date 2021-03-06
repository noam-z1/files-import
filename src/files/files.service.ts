import { Injectable } from '@nestjs/common';
import * as csv from 'csvtojson';
import { FilesRepo } from './files.repo';
import { createReadStream, unlinkSync } from 'fs';

export type fileWithHospitalId = Express.Multer.File & { hospitalId: string };

@Injectable()
export class FilesService {
  constructor(private repo: FilesRepo) {}

  async parseFile(file: fileWithHospitalId) {
    const { hospitalId, fieldname: fileType, path } = file;
    const collection = `Hospital${hospitalId}-${fileType}`;
    const fields = await this.repo.getUniqueFields(hospitalId, fileType);
    const data = [];
    try {
      await csv()
        .fromStream(createReadStream(path))
        .subscribe(async (row) => {
          if (fields?.length) {
            this.repo.upsertWithUniqueFields(fields, row, collection);
          } else {
            data.push(row);
            if (data.length === parseInt(process.env.BULK_SIZE)) {
              this.repo.createMany(data, collection);
              data.length = 0;
            }
          }
        });

      if (!fields || fields.length === 0) {
        this.repo.createMany(data, collection);
      }
      unlinkSync(path);
    } catch (e) {
      console.log(`Error parsing files, ${e}`);
    }
  }
}
