import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";

@Controller('/auth')
export class AuthController {
  constructor(
    private authervice: AuthService,
  ) {}

  @Post('/login')
  async login(@Body() body: LoginDto){
    const token = await this.authervice.login(body.hospitalId, body.password);
    return token;
  }

  @Post('/signup')
  async signUp(@Body() body: SignupDto){
    const token = await this.authervice.signUp(body);
    return token;
  }

  
}
