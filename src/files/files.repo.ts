import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';

@Injectable()
export class FilesRepo {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private db: Db,
  ) {}

  async createMany(rows, collection: string) {
    await this.db.collection(collection).insertMany(rows);
  }

  async upsertWithUniqueFields(fields: string[], row, collection: string) {
    const Itemfields = {};
    fields.forEach((field) => {
      Itemfields[field] = row[field];
    });
    await this.db
      .collection(collection)
      .updateOne(Itemfields, { $set: row }, { upsert: true });
  }

  async getUniqueFields(hospitalId: string, fileType: string) {
    const fields = await this.db
      .collection('hospitals')
      .findOne({ id: hospitalId });
    if (!fields) {
      throw new HttpException('Hospital id not found', HttpStatus.BAD_REQUEST);
    }
    try {
      return fields.uniqueColumns[fileType];
    } catch (e) {
      return null;
    }
  }
}
