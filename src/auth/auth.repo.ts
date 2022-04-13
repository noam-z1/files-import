import { Inject, Injectable } from "@nestjs/common";
import { Db } from "mongodb";

@Injectable()
export class AuthRepo {
    constructor(
        @Inject('DATABASE_CONNECTION')
        private db: Db,
    ) {}

    async verifyHospital(hospitalId: string){
        const hospital = await this.db.collection('hospitals').findOne({ id: hospitalId });
        return hospital;
    }
}