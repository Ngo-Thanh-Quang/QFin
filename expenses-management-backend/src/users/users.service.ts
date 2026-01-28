import { Inject, Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';

@Injectable()
export class UsersService {
    constructor(
        @Inject('FIREBASE_AUTH') private adminAuth: any,
        @Inject('FIREBASE_DB') private adminDb: Firestore,
    ) { }

    async register(dto: RegisterUserDto) {
        const { idToken, lastName, firstName, phone } = dto;

        if (!idToken || !lastName || !firstName || !phone) {
            throw new BadRequestException('Thiếu dữ liệu');
        }

        try {
            const decoded = await this.adminAuth.verifyIdToken(idToken);
            const uid = decoded.uid;
            const email = decoded.email;

            if (!email) {
                throw new BadRequestException('Token không có email');
            }

            const docRef = this.adminDb.collection('users').doc(uid);
            await docRef.set(
                {
                    lastName: lastName.trim(),
                    firstName: firstName.trim(),
                    phone: phone.trim(),
                    email: email.toLowerCase(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                { merge: true },
            );

            return { ok: true };
        } catch (error) {
            console.error('Error in UsersService.register', {
                message: error?.message,
                code: error?.code,
                stack: error?.stack,
                raw: error,
            });
            throw new InternalServerErrorException('Lỗi server khi lưu user');
        }
    }

    async getProfile(authorization?: string) {
        if (!authorization?.startsWith('Bearer ')) {
            throw new BadRequestException('Thiếu token');
        }

        const idToken = authorization.replace('Bearer ', '').trim();

        try {
            const decoded = await this.adminAuth.verifyIdToken(idToken);
            const uid = decoded.uid;
            const email = decoded.email;

            if (!email) {
                throw new BadRequestException('Token không có email');
            }

            const docRef = this.adminDb.collection('users').doc(uid);
            const snapshot = await docRef.get();

            if (!snapshot.exists) {
                return { ok: true, profile: null };
            }

            const data = snapshot.data();

            return { ok: true, profile: data };
        } catch (error) {
            console.error('Error in UsersService.getProfile', {
                message: error?.message,
                code: error?.code,
                stack: error?.stack,
                raw: error,
            });
            throw new InternalServerErrorException('Lỗi server khi lấy user');
        }
    }

    async updateIncome(authorization?: string, dto?: UpdateIncomeDto) {
        if (!authorization?.startsWith('Bearer ')) {
            throw new BadRequestException('Thiếu token');
        }

        const idToken = authorization.replace('Bearer ', '').trim();

        if (dto?.incomeAmount === null || dto?.incomeAmount === undefined) {
            throw new BadRequestException('Thiếu thu nhập');
        }

        try {
            const decoded = await this.adminAuth.verifyIdToken(idToken);
            const uid = decoded.uid;

            const docRef = this.adminDb.collection('users').doc(uid);
            await docRef.set(
                {
                    incomeAmount: dto.incomeAmount,
                    updatedAt: new Date(),
                },
                { merge: true },
            );

            return { ok: true, incomeAmount: dto.incomeAmount };
        } catch (error) {
            console.error('Error in UsersService.updateIncome', {
                message: error?.message,
                code: error?.code,
                stack: error?.stack,
                raw: error,
            });
            throw new InternalServerErrorException('Lỗi server khi lưu thu nhập');
        }
    }
}
