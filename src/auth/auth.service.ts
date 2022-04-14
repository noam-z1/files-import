import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { sign } from "jsonwebtoken";
import { AuthRepo } from "./auth.repo";
import { SignupDto } from "./dto/signup.dto";

@Injectable()
export class AuthService {
    constructor(
        private repo: AuthRepo,
    ) {}

    async login(
        hospitalId: string,
        password?: string,
    ): Promise<{ accessToken: string | undefined }> {
        const hospital = await this.repo.verifyHospital(hospitalId);
        if (!hospital){
            throw new HttpException('Hospital id not found', HttpStatus.BAD_REQUEST);
        }
        //For demonstration
        if (password && password !== hospital.password) {
            return undefined;
        }

        return {
            accessToken: sign({
                hospitalId,
            },
                process.env.TOKEN_SECRET,
                {
                    expiresIn: '1h',
                },
            )
        };
    }

    async signUp(
        hospitalData: SignupDto,
    ){
        const { hospitalId, password, uniqueColumns } = hospitalData
        return this.repo.upsertHospital(hospitalId, password, uniqueColumns);
    }
}