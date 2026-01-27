import { Module } from '@nestjs/common';
import { FirebaseModule } from '../firebase/firebase.module';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';

@Module({
  imports: [FirebaseModule],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
