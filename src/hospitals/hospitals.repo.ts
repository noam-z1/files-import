import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Db } from "mongodb";
import { UniqueColumns } from "./dto/signup.dto";

@Injectable()
export class HospitalsRepo {
    constructor(
        @Inject('DATABASE_CONNECTION')
        private db: Db,
    ) {}

    async verifyHospital(hospitalId: string){
        const hospital = await this.db.collection('hospitals').findOne({ id: hospitalId });
        return hospital;
    }

    async createHospital(hospitalId: string, password?: string, uniqueColumns?: UniqueColumns){
        const hospital = await this.db.collection('hospitals').findOne({ id: hospitalId });
        if (hospital) {
            throw new HttpException('Hospital id already exists', HttpStatus.BAD_REQUEST);
        }
        return this.db.collection('hospitals').insertOne({ hospitalId, password, uniqueColumns })
    }

    async updateHospitalUniqueColumns(hospitalId: string, uniqueColumns: UniqueColumns){
        let result;
        console.log(hospitalId, uniqueColumns)
        try {
            result = await this.db.collection('hospitals').updateOne({ id: hospitalId }, { $set: {uniqueColumns }});
        } catch (e) {
            console.log(e)
            throw new HttpException('Unable to update', HttpStatus.BAD_REQUEST);
        }
        return result;
    }
}