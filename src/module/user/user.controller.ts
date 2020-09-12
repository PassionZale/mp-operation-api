import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';

import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { CreateUserRequestDto } from './dto/request/create-user.request.dto';
import { JwtAuthGuard } from '@src/guard/jwt-auth.guard';
import { RoleGuard } from '@src/guard/role.guard';
import { Role } from '@src/common/decorator/role.decorator';
import { UserRole } from '@src/common/enum/user-role.enum';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user/:id')
  @Role(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  public async find(@Param('id') id: number): Promise<UserEntity> {
    const user = await this.userService.findOne({ id });
    return user;
  }

  @Get('users')
  @Role(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  public async findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Post('user')
  @Role(UserRole.SUPERMAN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  public async create(@Body() body: CreateUserRequestDto): Promise<UserEntity> {
    const user = await this.userService.create(body);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashed_password, ...result } = user;

    // typeorm repository.save() 现在会忽略 @Column({ select: false })，仍然会返回 hahsed_password
    // 所以此处解构掉 hashed_password 再返回
    return result;
  }
}
