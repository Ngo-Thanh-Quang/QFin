import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import * as admin from 'firebase-admin';
import { CreateSavingsDto } from './dto/create-savings.dto';

@Injectable()
export class SavingsService {
  constructor(@Inject('FIREBASE_DB') private readonly db: Firestore) {}

  async createSavings(uid: string, dto: CreateSavingsDto) {
    if (!uid) {
      throw new BadRequestException('Thiếu người dùng');
    }

    const dateValue = dto.date ? new Date(dto.date) : new Date();
    if (Number.isNaN(dateValue.getTime())) {
      throw new BadRequestException('Ngày không hợp lệ');
    }

    const year = dateValue.getFullYear();
    const month = dateValue.getMonth() + 1;
    const day = dateValue.getDate();

    const userDocRef = this.db.collection('users').doc(uid);
    const savingsCol = userDocRef.collection('savings');
    const savingsRef = savingsCol.doc();

    const payload = {
      amount: dto.amount,
      description: dto.description?.trim() || null,
      date: admin.firestore.Timestamp.fromDate(dateValue),
      year,
      month,
      day,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    try {
      await savingsRef.set(payload);
      return { ok: true, id: savingsRef.id };
    } catch (error) {
      console.error('createSavings error:', error);
      throw new InternalServerErrorException('Lỗi khi lưu tiết kiệm');
    }
  }
}
