import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { HospitalsRepo } from './hospitals.repo';
import { SignupDto, UniqueColumns } from './dto/signup.dto';

@Injectable()
export class HospitalsService {
  constructor(private repo: HospitalsRepo) {}

  async login(
    hospitalId: string,
    password?: string,
  ): Promise<{ accessToken: string | undefined }> {
    const hospital = await this.repo.verifyHospital(hospitalId);
    if (!hospital) {
      throw new HttpException('Hospital id not found', HttpStatus.BAD_REQUEST);
    }
    //For demonstration
    if (password && password !== hospital.password) {
      return undefined;
    }

    return {
      accessToken: sign(
        {
          hospitalId,
        },
        process.env.TOKEN_SECRET,
        {
          expiresIn: '1h',
        },
      ),
    };
  }

  async signUp(hospitalData: SignupDto) {
    const { hospitalId, password, uniqueColumns } = hospitalData;
    return this.repo.createHospital(hospitalId, password, uniqueColumns);
  }

  async updateSpecialColumns(hospitalId: string, uniqueColumns: UniqueColumns) {
    return this.repo.updateHospitalUniqueColumns(hospitalId, uniqueColumns);
  }
}
