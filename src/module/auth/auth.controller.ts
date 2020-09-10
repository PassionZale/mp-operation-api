import {
  Controller,
  Body,
  Post,
  UseGuards,
  Get
} from '@nestjs/common';

import { AuthService } from '../auth/auth.service';
import { LoginRequestDto } from './dto/request/login.request.dto';
import { LoginResponseDto } from './dto/response/login.reponse.dto';
import { IUserData } from '@src/module/user/user.interface';
import { JwtAuthGuard } from '@src/guard/jwt-auth.guard';
import { ApiException } from '@src/filter/api-exception.filter';
import { CurrentUser } from '@src/common/decorator/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  public async login(@Body() body: LoginRequestDto): Promise<LoginResponseDto> {
    const { job_number, password } = body;

    const user = await this.authService.validateUserPassword(job_number, password);

    if (!user) throw new ApiException('用户名或密码错误');

    return this.authService.createAccessToken(user);
  }

  @Get('userinfo')
  @UseGuards(JwtAuthGuard)
  public userInfo(@CurrentUser() user: IUserData): IUserData {
    return user;
  }
}
