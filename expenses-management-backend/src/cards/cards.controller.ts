import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardsService } from './cards.service';

@Controller('api/cards')
export class CardsController {
  constructor(private readonly svc: CardsService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post()
  async create(@Req() req: Request, @Body() dto: CreateCardDto) {
    const uid = (req as any).user?.uid;
    return this.svc.createCard(uid, dto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get()
  async list(@Req() req: Request) {
    const uid = (req as any).user?.uid;
    return this.svc.listCards(uid);
  }

  @UseGuards(FirebaseAuthGuard)
  @Patch(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateCardDto) {
    const uid = (req as any).user?.uid;
    return this.svc.updateCard(uid, id, dto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    const uid = (req as any).user?.uid;
    return this.svc.deleteCard(uid, id);
  }
}
