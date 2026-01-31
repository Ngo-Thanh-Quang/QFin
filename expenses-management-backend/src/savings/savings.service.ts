import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import * as admin from 'firebase-admin';
import { CreateSavingsDto } from './dto/create-savings.dto';
import { UpdateSavingsDto } from './dto/update-savings.dto';

type SavingsItem = {
  id: string;
  amount: number;
  description?: string | null;
  date: string | null;
  createdAt: string | null;
  year?: number;
  month?: number;
  day?: number;
};

@Injectable()
export class SavingsService {
  constructor(@Inject('FIREBASE_DB') private readonly db: Firestore) {}

  private normalizeSavings(id: string, data: FirebaseFirestore.DocumentData): SavingsItem {
    const rawDate = data.date as any;
    let dateIso: string | null = null;
    if (rawDate?.toDate) {
      dateIso = rawDate.toDate().toISOString();
    } else if (rawDate?.seconds) {
      dateIso = new Date(rawDate.seconds * 1000).toISOString();
    } else if (typeof rawDate === 'string') {
      dateIso = new Date(rawDate).toISOString();
    }
    const rawCreatedAt = data.createdAt as any;
    let createdAtIso: string | null = null;
    if (rawCreatedAt?.toDate) {
      createdAtIso = rawCreatedAt.toDate().toISOString();
    } else if (rawCreatedAt?.seconds) {
      createdAtIso = new Date(rawCreatedAt.seconds * 1000).toISOString();
    } else if (typeof rawCreatedAt === 'string') {
      createdAtIso = new Date(rawCreatedAt).toISOString();
    }
    return {
      id,
      amount: Number(data.amount ?? 0),
      description: data.description ?? null,
      date: dateIso,
      createdAt: createdAtIso,
      year: data.year,
      month: data.month,
      day: data.day,
    };
  }

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

  async listSavings(uid: string, month?: string) {
    if (!uid) {
      throw new BadRequestException('Thiếu người dùng');
    }
    const today = new Date();
    const [year, monthValue] = month
      ? month.split('-').map(Number)
      : [today.getFullYear(), today.getMonth() + 1];
    if (!year || !monthValue) {
      throw new BadRequestException('Tháng không hợp lệ, định dạng YYYY-MM');
    }

    const col = this.db.collection('users').doc(uid).collection('savings');
    const snap = await col
      .where('year', '==', year)
      .where('month', '==', monthValue)
      .orderBy('date', 'desc')
      .orderBy('createdAt', 'desc')
      .get();

    const items: SavingsItem[] = snap.docs.map((d) =>
      this.normalizeSavings(d.id, d.data()),
    );
    const totalAmount = items.reduce(
      (sum, item) => sum + Number(item.amount ?? 0),
      0,
    );

    return {
      month: `${year}-${String(monthValue).padStart(2, '0')}`,
      count: items.length,
      totalAmount,
      items,
    };
  }

  async getTotalSavings(uid: string) {
    if (!uid) {
      throw new BadRequestException('Thiếu người dùng');
    }
    const col = this.db.collection('users').doc(uid).collection('savings');
    const snap = await col.get();
    const totalAmount = snap.docs.reduce(
      (sum, doc) => sum + Number(doc.data()?.amount ?? 0),
      0,
    );
    return { totalAmount };
  }

  async getMonthlySavingsForYear(uid: string, year: number) {
    if (!uid) {
      throw new BadRequestException('Thiếu người dùng');
    }
    const col = this.db.collection('users').doc(uid).collection('savings');
    const snap = await col.where('year', '==', year).get();
    const totals: Record<string, number> = {};
    snap.docs.forEach((doc) => {
      const data = doc.data() as any;
      const monthValue = Number(data.month ?? 0);
      if (!monthValue) return;
      const monthKey = `${year}-${String(monthValue).padStart(2, '0')}`;
      const amount = Number(data.amount ?? 0);
      totals[monthKey] = (totals[monthKey] ?? 0) + amount;
    });

    const items = Object.entries(totals).map(([month, totalAmount]) => ({
      month,
      totalAmount,
    }));

    return { year, items };
  }

  async updateSavings(uid: string, id: string, dto: UpdateSavingsDto) {
    if (!uid) {
      throw new BadRequestException('Thiếu người dùng');
    }
    const docRef = this.db.collection('users').doc(uid).collection('savings').doc(id);
    const payload: Record<string, any> = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (dto.amount !== undefined) {
      payload.amount = dto.amount;
    }
    if (dto.description !== undefined) {
      const trimmed = dto.description.trim();
      payload.description = trimmed ? trimmed : null;
    }
    if (dto.date !== undefined) {
      const dateValue = new Date(dto.date);
      if (Number.isNaN(dateValue.getTime())) {
        throw new BadRequestException('Ngày không hợp lệ');
      }
      payload.date = admin.firestore.Timestamp.fromDate(dateValue);
      payload.year = dateValue.getFullYear();
      payload.month = dateValue.getMonth() + 1;
      payload.day = dateValue.getDate();
    }

    try {
      await docRef.set(payload, { merge: true });
      return { ok: true };
    } catch (error) {
      console.error('updateSavings error:', error);
      throw new InternalServerErrorException('Lỗi khi cập nhật tiết kiệm');
    }
  }

  async deleteSavings(uid: string, id: string) {
    if (!uid) {
      throw new BadRequestException('Thiếu người dùng');
    }
    const docRef = this.db.collection('users').doc(uid).collection('savings').doc(id);
    try {
      await docRef.delete();
      return { ok: true };
    } catch (error) {
      console.error('deleteSavings error:', error);
      throw new InternalServerErrorException('Lỗi khi xoá tiết kiệm');
    }
  }
}
