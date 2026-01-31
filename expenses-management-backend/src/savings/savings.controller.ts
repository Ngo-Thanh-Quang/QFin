import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CreateSavingsDto } from './dto/create-savings.dto';
import { SavingsService } from './savings.service';

@Controller('api/savings')
export class SavingsController {
  constructor(private readonly svc: SavingsService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post()
  async create(@Req() req: Request, @Body() dto: CreateSavingsDto) {
    const uid = (req as any).user?.uid;
    return this.svc.createSavings(uid, dto);
  }
}
