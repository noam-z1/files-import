import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

@Controller('/auth')
export class AuthController {
  constructor(
    private authervice: AuthService,
  ) {}

  @Post()
  async login(@Body() body: LoginDto){
    const token = await this.authervice.login(body.hospitalId, body.password);
    return token;
  }
}
