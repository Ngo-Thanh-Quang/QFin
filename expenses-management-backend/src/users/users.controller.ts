import { Body, Controller, Get, Headers, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';

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

  @Patch('me/income')
  async updateIncome(
    @Headers('authorization') authorization: string | undefined,
    @Body() dto: UpdateIncomeDto,
  ) {
    return this.usersService.updateIncome(authorization, dto);
  }
}
