import { Module } from '@nestjs/common';
import { FirebaseModule } from '../firebase/firebase.module';
import { SavingsController } from './savings.controller';
import { SavingsService } from './savings.service';

@Module({
  imports: [FirebaseModule],
  controllers: [SavingsController],
  providers: [SavingsService],
})
export class SavingsModule {}
