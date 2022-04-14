import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { parse } from 'papaparse';
import { FilesRepo } from './files.repo';
import { unlinkSync } from 'fs';

export type fileWithHospitalId = Express.Multer.File & { hospitalId: string };

@Injectable()
export class FilesService {
    constructor(
        private repo: FilesRepo,
    ) {}

    async parseFile(file: fileWithHospitalId){
        //ToDo: read file and parse line by line
        const collection = `Hospital${file.hospitalId}-${file.fieldname}`
        const csvFile = await readFile(file.path);
        const csvData = csvFile.toString();

        const parsedCSV = await parse(csvData, {
            header: true,
            skipEmptyLined: true,
            transformHeader: (header) => header.toLowerCase().replace('#', '').trim(),
            complete: (results) => { results.data },
        });

        this.repo.createMany(parsedCSV.data, collection);

        unlinkSync(file.path);
    }
}
