import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CreateSavingsDto } from './dto/create-savings.dto';
import { UpdateSavingsDto } from './dto/update-savings.dto';
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

  @UseGuards(FirebaseAuthGuard)
  @Get()
  async list(@Req() req: Request, @Query('month') month?: string) {
    const uid = (req as any).user?.uid;
    return this.svc.listSavings(uid, month);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('summary')
  async summary(@Req() req: Request) {
    const uid = (req as any).user?.uid;
    return this.svc.getTotalSavings(uid);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('monthly')
  async monthly(@Req() req: Request, @Query('year') year?: string) {
    const uid = (req as any).user?.uid;
    const targetYear = year ? Number(year) : new Date().getFullYear();
    return this.svc.getMonthlySavingsForYear(uid, targetYear);
  }

  @UseGuards(FirebaseAuthGuard)
  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateSavingsDto,
  ) {
    const uid = (req as any).user?.uid;
    return this.svc.updateSavings(uid, id, dto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    const uid = (req as any).user?.uid;
    return this.svc.deleteSavings(uid, id);
  }
}
