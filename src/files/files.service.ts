import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { parse } from 'papaparse';
import { FilesRepo } from './files.repo';

@Injectable()
export class FilesService {
    constructor(
        private repo: FilesRepo,
    ) {}

    async parseFile(file: Express.Multer.File){
        //ToDo: read file and parse line by line
        const collection = `Hospital${file.filename.split('.', 2).join('-')}`
        const csvFile = await readFile(file.path);
        const csvData = csvFile.toString();

        const parsedCSV = await parse(csvData, {
            header: true,
            skipEmptyLined: true,
            transformHeader: (header) => header.toLowerCase().replace('#', '').trim(),
            complete: (results) => { results.data },
        });

        this.repo.createMany(parsedCSV.data, collection);
    }
}
