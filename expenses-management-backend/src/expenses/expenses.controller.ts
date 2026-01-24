import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import type { Request } from 'express';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Controller('api/expenses')
export class ExpensesController {
  constructor(private readonly svc: ExpensesService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post()
  async create(@Req() req: Request, @Body() dto: CreateExpenseDto) {
    // req.user set by guard
    const uid = (req as any).user?.uid;
    return this.svc.createExpense(uid, dto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Patch(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateExpenseDto) {
    const uid = (req as any).user?.uid;
    return this.svc.updateExpense(uid, id, dto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    const uid = (req as any).user?.uid;
    return this.svc.deleteExpense(uid, id);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get()
  async list(@Req() req: Request, @Query('month') month?: string, @Query('limit') limit?: string) {
    const uid = (req as any).user?.uid;
    // expect month format YYYY-MM; default to current
    const today = new Date();
    const [y, m] = month ? month.split('-').map(Number) : [today.getFullYear(), today.getMonth() + 1];
    const pageLimit = limit ? Number(limit) : 50;
    return this.svc.getExpensesForMonth(uid, y, m, pageLimit);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('summary')
  async summary(@Req() req: Request, @Query('month') month?: string) {
    const uid = (req as any).user?.uid;
    const today = new Date();
    const [y, m] = month ? month.split('-').map(Number) : [today.getFullYear(), today.getMonth() + 1];
    return this.svc.getMonthlySummary(uid, y, m);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('breakdown')
  async breakdown(@Req() req: Request, @Query('month') month?: string) {
    const uid = (req as any).user?.uid;
    const today = new Date();
    const [y, m] = month ? month.split('-').map(Number) : [today.getFullYear(), today.getMonth() + 1];
    return this.svc.getMonthlyBreakdown(uid, y, m);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('all')
  async listAll(@Req() req: Request) {
    const uid = (req as any).user?.uid;
    return this.svc.getAllExpenses(uid);
  }
}
