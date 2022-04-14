import { Body, Controller, Post } from "@nestjs/common";
import { HospitalsService } from "./hospitals.service";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";

@Controller('/hospitals')
export class HospitalsController {
  constructor(
    private hospitalservice: HospitalsService,
  ) {}

  @Post('/login')
  async login(@Body() body: LoginDto){
    const token = await this.hospitalservice.login(body.hospitalId, body.password);
    return token;
  }

  @Post('/signup')
  async signUp(@Body() body: SignupDto){
    const token = await this.hospitalservice.signUp(body);
    return token;
  }

  
}
