// src/expenses/expenses.service.ts
import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import * as admin from 'firebase-admin';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(@Inject('FIREBASE_DB') private readonly db: Firestore) {}

  private parseAmount(amountStr: string): number {
    return Math.round(Number(String(amountStr).replace(/,/g, '')));
  }

  private normalizeExpense(id: string, data: FirebaseFirestore.DocumentData) {
    const rawDate = data.date as any;
    let dateIso: string | null = null;
    if (rawDate?.toDate) {
      dateIso = rawDate.toDate().toISOString();
    } else if (rawDate?.seconds) {
      dateIso = new Date(rawDate.seconds * 1000).toISOString();
    } else if (typeof rawDate === 'string') {
      dateIso = new Date(rawDate).toISOString();
    }
    return { id, ...data, date: dateIso };
  }

  private resolveCategoryKey(categoryId?: string | null) {
    return categoryId || 'uncategorized';
  }

  private getWeekRange(date: Date) {
    const base = new Date(date);
    const day = base.getDay();
    const diffToMonday = (day + 6) % 7;
    const start = new Date(base);
    start.setDate(base.getDate() - diffToMonday);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  async createExpense(uid: string, dto: CreateExpenseDto) {
    const amount = this.parseAmount(dto.amount);
    const currency = dto.currency ?? 'VND';
    const type = dto.type; // 'expense' | 'income'
    const dateIso = dto.date ? new Date(dto.date) : new Date();
    if (dateIso.getTime() > Date.now()) {
      throw new BadRequestException('Thời gian chi tiêu không hợp lệ');
    }
    const year = dateIso.getFullYear();
    const month = dateIso.getMonth() + 1;
    const day = dateIso.getDate();

    const userDocRef = this.db.collection('users').doc(uid);
    const userExpensesCol = userDocRef.collection('expenses');
    const monthlyDocRef = userDocRef.collection('monthly').doc(`${year}-${String(month).padStart(2, '0')}`);
    const newExpenseRef = userExpensesCol.doc(); // auto-generated id

    const payload = {
      name: dto.name,
      amount,
      currency,
      type,
      categoryId: dto.categoryId || null,
      categoryName: dto.categoryName || null,
      date: admin.firestore.Timestamp.fromDate(dateIso),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      year,
      month,
      day,
    };

    try {
      await this.db.runTransaction(async (tx) => {
        // 1) ALL reads first
        const monthlySnap = await tx.get(monthlyDocRef);

        // 2) prepare writes AFTER reads
        tx.set(newExpenseRef, payload);

        if (!monthlySnap.exists) {
          const init = {
            month: `${year}-${String(month).padStart(2, '0')}`,
            totalExpense: type === 'expense' ? amount : 0,
            totalIncome: type === 'income' ? amount : 0,
            byCategory: type === 'expense' ? { [dto.categoryId || 'uncategorized']: amount } : {},
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          };
          tx.set(monthlyDocRef, init, { merge: true });
        } else {
          // update totals atomically with increments
          const categoryKey = `byCategory.${dto.categoryId || 'uncategorized'}`;
          tx.update(monthlyDocRef, {
            totalExpense: type === 'expense' ? admin.firestore.FieldValue.increment(amount) : admin.firestore.FieldValue.increment(0),
            totalIncome: type === 'income' ? admin.firestore.FieldValue.increment(amount) : admin.firestore.FieldValue.increment(0),
            [categoryKey]: type === 'expense' ? admin.firestore.FieldValue.increment(amount) : admin.firestore.FieldValue.increment(0),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      });

      return { id: newExpenseRef.id, ok: true };
    } catch (err) {
      console.error('createExpense transaction error:', err);
      throw new InternalServerErrorException('Lỗi khi lưu chi tiêu');
    }
  }

  async getExpensesForMonth(uid: string, year: number, month: number, limit = 50, startAfter?: string) {
    const col = this.db.collection('users').doc(uid).collection('expenses');
    let q: FirebaseFirestore.Query = col.where('year', '==', year).where('month', '==', month).orderBy('date', 'desc').limit(limit);
    if (startAfter) {
      const startDoc = await col.doc(startAfter).get();
      if (startDoc.exists) q = q.startAfter(startDoc);
    }
    const snap = await q.get();
    const items = snap.docs.map((d) => this.normalizeExpense(d.id, d.data()));
    return { items, count: items.length };
  }

  async getAllExpenses(uid: string) {
    const col = this.db.collection('users').doc(uid).collection('expenses');
    const snap = await col.orderBy('date', 'desc').get();
    const items = snap.docs.map((d) => this.normalizeExpense(d.id, d.data()));
    return { items, count: items.length };
  }

  async getMonthlySummary(uid: string, year: number, month: number) {
    const currentId = `${year}-${String(month).padStart(2, '0')}`;
    const prevDate = new Date(year, month - 2, 1);
    const prevId = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

    const userDocRef = this.db.collection('users').doc(uid);
    const currentRef = userDocRef.collection('monthly').doc(currentId);
    const prevRef = userDocRef.collection('monthly').doc(prevId);

    const [currentSnap, prevSnap] = await Promise.all([
      currentRef.get(),
      prevRef.get(),
    ]);

    const currentTotal = Number(currentSnap.data()?.totalExpense ?? 0);
    const prevTotal = Number(prevSnap.data()?.totalExpense ?? 0);

    return {
      current: { month: currentId, totalExpense: currentTotal },
      previous: { month: prevId, totalExpense: prevTotal },
    };
  }

  async getWeeklySummary(uid: string, date: Date) {
    const { start, end } = this.getWeekRange(date);
    const userDocRef = this.db.collection('users').doc(uid);
    const col = userDocRef.collection('expenses');
    const snap = await col
      .where('type', '==', 'expense')
      .where('date', '>=', admin.firestore.Timestamp.fromDate(start))
      .where('date', '<=', admin.firestore.Timestamp.fromDate(end))
      .get();

    const totalExpense = snap.docs.reduce((sum, d) => sum + Number(d.data()?.amount ?? 0), 0);

    return {
      start: start.toISOString().slice(0, 10),
      end: end.toISOString().slice(0, 10),
      totalExpense,
    };
  }

  async getMonthlyBreakdown(uid: string, year: number, month: number) {
    const currentId = `${year}-${String(month).padStart(2, '0')}`;
    const userDocRef = this.db.collection('users').doc(uid);
    const currentRef = userDocRef.collection('monthly').doc(currentId);
    const snap = await currentRef.get();
    const data = snap.data() || {};
    const byCategory = (data.byCategory || {}) as Record<string, number>;
    const totalExpense = Number(data.totalExpense ?? 0);

    return {
      month: currentId,
      totalExpense,
      byCategory,
    };
  }

  async updateExpense(uid: string, expenseId: string, dto: UpdateExpenseDto) {
    const userDocRef = this.db.collection('users').doc(uid);
    const expenseRef = userDocRef.collection('expenses').doc(expenseId);

    try {
      const updated = await this.db.runTransaction(async (tx) => {
        const expenseSnap = await tx.get(expenseRef);
        if (!expenseSnap.exists) {
          throw new BadRequestException('Không tìm thấy chi tiêu');
        }

        const current = expenseSnap.data() as any;
        const currentDate = current?.date?.toDate ? current.date.toDate() : new Date(current?.date ?? new Date());
        const currentAmount = Number(current?.amount ?? 0);
        const currentType = current?.type ?? 'expense';
        const currentCategoryId = current?.categoryId ?? null;
        const currentYear = current?.year ?? currentDate.getFullYear();
        const currentMonth = current?.month ?? currentDate.getMonth() + 1;
        const currentDay = current?.day ?? currentDate.getDate();

        const nextAmount = dto.amount ? this.parseAmount(dto.amount) : currentAmount;
        const nextType = dto.type ?? currentType;
        const nextDate = dto.date ? new Date(dto.date) : currentDate;
        if (nextDate.getTime() > Date.now()) {
          throw new BadRequestException('Thời gian chi tiêu không hợp lệ');
        }
        const nextYear = nextDate.getFullYear();
        const nextMonth = nextDate.getMonth() + 1;
        const nextDay = nextDate.getDate();
        const nextCategoryId = dto.categoryId ?? currentCategoryId;
        const nextCategoryName = dto.categoryName ?? current?.categoryName ?? null;

        const payload = {
          name: dto.name ?? current?.name,
          amount: nextAmount,
          currency: dto.currency ?? current?.currency ?? 'VND',
          type: nextType,
          categoryId: nextCategoryId,
          categoryName: nextCategoryName,
          date: admin.firestore.Timestamp.fromDate(nextDate),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          year: nextYear,
          month: nextMonth,
          day: nextDay,
        };

        const currentMonthlyId = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
        const nextMonthlyId = `${nextYear}-${String(nextMonth).padStart(2, '0')}`;
        const currentMonthlyRef = userDocRef.collection('monthly').doc(currentMonthlyId);
        const nextMonthlyRef = userDocRef.collection('monthly').doc(nextMonthlyId);
        const currentMonthlySnap = await tx.get(currentMonthlyRef);
        const nextMonthlySnap =
          currentMonthlyRef.path === nextMonthlyRef.path
            ? currentMonthlySnap
            : await tx.get(nextMonthlyRef);

        const amountDiffExpense =
          (nextType === 'expense' ? nextAmount : 0) -
          (currentType === 'expense' ? currentAmount : 0);
        const amountDiffIncome =
          (nextType === 'income' ? nextAmount : 0) -
          (currentType === 'income' ? currentAmount : 0);

        const currentCategoryKey = this.resolveCategoryKey(currentCategoryId);
        const nextCategoryKey = this.resolveCategoryKey(nextCategoryId);

        tx.update(expenseRef, payload);

        if (currentMonthlyRef.path === nextMonthlyRef.path) {
          const updatePayload: Record<string, any> = {
            totalExpense: admin.firestore.FieldValue.increment(amountDiffExpense),
            totalIncome: admin.firestore.FieldValue.increment(amountDiffIncome),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          };

          if (currentType === 'expense' && currentCategoryKey !== nextCategoryKey) {
            updatePayload[`byCategory.${currentCategoryKey}`] =
              admin.firestore.FieldValue.increment(-currentAmount);
          }

          if (nextType === 'expense') {
            const deltaForCategory =
              currentType === 'expense' && currentCategoryKey === nextCategoryKey
                ? nextAmount - currentAmount
                : nextAmount;
            updatePayload[`byCategory.${nextCategoryKey}`] =
              admin.firestore.FieldValue.increment(deltaForCategory);
          } else if (currentType === 'expense' && currentCategoryKey === nextCategoryKey) {
            updatePayload[`byCategory.${currentCategoryKey}`] =
              admin.firestore.FieldValue.increment(-currentAmount);
          }

          if (currentMonthlySnap.exists) {
            tx.update(currentMonthlyRef, updatePayload);
          } else {
            console.warn('updateExpense: monthly doc missing', {
              uid,
              monthlyId: currentMonthlyId,
            });
          }
        } else {
          const decrementPayload: Record<string, any> = {
            totalExpense: admin.firestore.FieldValue.increment(currentType === 'expense' ? -currentAmount : 0),
            totalIncome: admin.firestore.FieldValue.increment(currentType === 'income' ? -currentAmount : 0),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          };
          if (currentType === 'expense') {
            decrementPayload[`byCategory.${currentCategoryKey}`] =
              admin.firestore.FieldValue.increment(-currentAmount);
          }
          if (currentMonthlySnap.exists) {
            tx.update(currentMonthlyRef, decrementPayload);
          } else {
            console.warn('updateExpense: current monthly doc missing', {
              uid,
              monthlyId: currentMonthlyId,
            });
          }

          const incrementPayload: Record<string, any> = {
            totalExpense: admin.firestore.FieldValue.increment(nextType === 'expense' ? nextAmount : 0),
            totalIncome: admin.firestore.FieldValue.increment(nextType === 'income' ? nextAmount : 0),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          };
          if (nextType === 'expense') {
            incrementPayload[`byCategory.${nextCategoryKey}`] =
              admin.firestore.FieldValue.increment(nextAmount);
          }
          if (nextMonthlySnap.exists) {
            tx.update(nextMonthlyRef, incrementPayload);
          } else {
            console.warn('updateExpense: next monthly doc missing', {
              uid,
              monthlyId: nextMonthlyId,
            });
          }
        }

        return this.normalizeExpense(expenseSnap.id, { ...current, ...payload });
      });

      return { ok: true, expense: updated };
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      console.error('updateExpense transaction error:', err);
      throw new InternalServerErrorException('Lỗi khi cập nhật chi tiêu');
    }
  }

  async deleteExpense(uid: string, expenseId: string) {
    const userDocRef = this.db.collection('users').doc(uid);
    const expenseRef = userDocRef.collection('expenses').doc(expenseId);

    try {
      await this.db.runTransaction(async (tx) => {
        const expenseSnap = await tx.get(expenseRef);
        if (!expenseSnap.exists) {
          throw new BadRequestException('Không tìm thấy chi tiêu');
        }

        const current = expenseSnap.data() as any;
        const currentDate = current?.date?.toDate ? current.date.toDate() : new Date(current?.date ?? new Date());
        const currentAmount = Number(current?.amount ?? 0);
        const currentType = current?.type ?? 'expense';
        const currentCategoryId = current?.categoryId ?? null;
        const currentYear = current?.year ?? currentDate.getFullYear();
        const currentMonth = current?.month ?? currentDate.getMonth() + 1;

        console.log('deleteExpense', {
          uid,
          expenseId,
          amount: currentAmount,
          type: currentType,
          categoryId: currentCategoryId,
          year: currentYear,
          month: currentMonth,
        });

        const currentMonthlyRef = userDocRef.collection('monthly').doc(
          `${currentYear}-${String(currentMonth).padStart(2, '0')}`
        );

        const currentCategoryKey = this.resolveCategoryKey(currentCategoryId);
        const monthlySnap = await tx.get(currentMonthlyRef);
        const updatePayload: Record<string, any> = {
          totalExpense: admin.firestore.FieldValue.increment(currentType === 'expense' ? -currentAmount : 0),
          totalIncome: admin.firestore.FieldValue.increment(currentType === 'income' ? -currentAmount : 0),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        if (currentType === 'expense') {
          updatePayload[`byCategory.${currentCategoryKey}`] =
            admin.firestore.FieldValue.increment(-currentAmount);
        }

        console.log('deleteExpense.monthlyUpdate', {
          monthlyId: `${currentYear}-${String(currentMonth).padStart(2, '0')}`,
          updatePayload,
        });

        if (monthlySnap.exists) {
          tx.update(currentMonthlyRef, updatePayload);
        } else {
          console.warn('deleteExpense: monthly doc missing', {
            uid,
            monthlyId: `${currentYear}-${String(currentMonth).padStart(2, '0')}`,
          });
        }
        tx.delete(expenseRef);
      });

      return { ok: true };
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      console.error('deleteExpense transaction error:', err);
      throw new InternalServerErrorException('Lỗi khi xóa chi tiêu');
    }
  }
}
