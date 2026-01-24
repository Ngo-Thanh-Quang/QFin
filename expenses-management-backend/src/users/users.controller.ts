import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    return this.usersService.register(dto);
  }

  @Get('me')
  async me(@Headers('authorization') authorization?: string) {
    return this.usersService.getProfile(authorization);
  }
}
