import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import * as admin from 'firebase-admin';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardsService {
  constructor(@Inject('FIREBASE_DB') private readonly db: Firestore) {}

  async listCards(uid: string) {
    if (!uid) {
      throw new BadRequestException('Missing user id');
    }

    const cardsCol = this.db.collection('users').doc(uid).collection('cards');
    const snap = await cardsCol.orderBy('createdAt', 'desc').get();
    const items = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return { items, count: items.length };
  }

  async createCard(uid: string, dto: CreateCardDto) {
    if (!uid) {
      throw new BadRequestException('Missing user id');
    }

    const userDocRef = this.db.collection('users').doc(uid);
    const cardsCol = userDocRef.collection('cards');
    const newCardRef = cardsCol.doc();

    const payload = {
      name: dto.name,
      cardNumber: dto.cardNumber,
      bank: dto.bank,
      cardType: dto.cardType,
      expiry: dto.expiry,
      cvv: dto.cvv,
      last4: dto.cardNumber.slice(-4),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    try {
      await newCardRef.set(payload);
      return { id: newCardRef.id, ok: true };
    } catch (err) {
      console.error('createCard error:', err);
      throw new InternalServerErrorException('Lỗi khi lưu thẻ');
    }
  }

  async updateCard(uid: string, cardId: string, dto: UpdateCardDto) {
    if (!uid) {
      throw new BadRequestException('Missing user id');
    }

    const cardRef = this.db.collection('users').doc(uid).collection('cards').doc(cardId);
    const snap = await cardRef.get();
    if (!snap.exists) {
      throw new BadRequestException('Không tìm thấy thẻ');
    }

    const payload = {
      name: dto.name,
      cardNumber: dto.cardNumber,
      bank: dto.bank,
      cardType: dto.cardType,
      expiry: dto.expiry,
      cvv: dto.cvv,
      last4: dto.cardNumber.slice(-4),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    try {
      await cardRef.update(payload);
      return { id: cardId, ok: true };
    } catch (err) {
      console.error('updateCard error:', err);
      throw new InternalServerErrorException('Lỗi khi cập nhật thẻ');
    }
  }

  async deleteCard(uid: string, cardId: string) {
    if (!uid) {
      throw new BadRequestException('Missing user id');
    }

    const cardRef = this.db.collection('users').doc(uid).collection('cards').doc(cardId);
    const snap = await cardRef.get();
    if (!snap.exists) {
      throw new BadRequestException('Không tìm thấy thẻ');
    }

    try {
      await cardRef.delete();
      return { id: cardId, ok: true };
    } catch (err) {
      console.error('deleteCard error:', err);
      throw new InternalServerErrorException('Lỗi khi xóa thẻ');
    }
  }
}
