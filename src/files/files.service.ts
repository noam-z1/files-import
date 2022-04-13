import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { parse } from 'papaparse';

@Injectable()
export class FilesService {

    async parseFile(file: Express.Multer.File){
        //ToDo: read file and parse line by line
        const csvFile = await readFile(file.path);
        const csvData = csvFile.toString();

        const parsedCSV = await parse(csvData, {
            header: true,
            skipEmptyLined: true,
            transformHeader: (header) => header.toLowerCase().replace('#', '').trim(),
            complete: (results) => { console.log(results);results.data} ,
        });
    }
}
