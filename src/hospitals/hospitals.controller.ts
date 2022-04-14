import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto, UniqueColumns } from './dto/signup.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('/hospitals')
export class HospitalsController {
  constructor(private hospitalservice: HospitalsService) {}

  @Post('/login')
  async login(@Body() body: LoginDto) {
    const token = await this.hospitalservice.login(
      body.hospitalId,
      body.password,
    );
    return token;
  }

  @Post('/signup')
  async signUp(@Body() body: SignupDto) {
    const token = await this.hospitalservice.signUp(body);
    return token;
  }

  @Patch('/update')
  @UseGuards(JwtAuthGuard)
  async updateHospital(@Body() body: UniqueColumns, @Req() request) {
    const result = await this.hospitalservice.updateSpecialColumns(
      request.user.hospitalId,
      body,
    );
    return result;
  }
}
