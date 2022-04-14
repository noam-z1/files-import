import { Injectable } from '@nestjs/common';
import * as csv from 'csv-parser';
import { FilesRepo } from './files.repo';
import { createReadStream, unlinkSync } from 'fs';

export type fileWithHospitalId = Express.Multer.File & { hospitalId: string };

@Injectable()
export class FilesService {
    constructor(
        private repo: FilesRepo,
    ) {}

    async parseFile(file: fileWithHospitalId){
        const { hospitalId, fieldname: fileType, path } = file
        const collection = `Hospital${hospitalId}-${fileType}`;
        const data = [];
        try {
            createReadStream(path)
            .pipe(csv())
            .on('data', async (row) => {
                data.push(row);
                if (data.length === parseInt(process.env.BULK_SIZE)){
                    await this.repo.createMany(data, collection);
                    data.length = 0;
                }
            })
            .on('end', async () => {
                await this.repo.createMany(data, collection);
                unlinkSync(path);
            });
        } catch (e) {
            console.log(`Error parsing files, ${e}`);
        }
    }
}
