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

    async upsertHospital(hospitalId: string, password?: string, uniqueColumns?: string[]){
        const hospital = await this.db.collection('hospitals').findOne({ id: hospitalId });
        if (hospital) {
            return this.db.collection('hospitals').updateOne({__id: hospital._id}, { password, uniqueColumns })
        }
        return this.db.collection('hospitals').insertOne({ hospitalId, password, uniqueColumns })
    }
}