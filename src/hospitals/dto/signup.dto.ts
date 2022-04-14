import { AuthDto } from './auth.dto';

export type UniqueColumns = { [schema: string]: string[] };

export class SignupDto extends AuthDto {
  uniqueColumns?: UniqueColumns;
}
