import { Inject, Injectable } from "@nestjs/common";
import { Db } from "mongodb";

@Injectable()
export class FilesRepo {
    constructor(
        @Inject('DATABASE_CONNECTION')
        private db: Db,
    ) {}

    async createOne(file, collection: string){
        await this.db.collection(collection).insertOne(file);
    }

    async createMany(files, collection: string){
        await this.db.collection(collection).insertMany(files);
    }
}