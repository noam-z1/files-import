import { AuthDto } from "./auth.dto";

export class SignupDto extends AuthDto {
    uniqueColumns?: string[];
}