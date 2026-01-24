import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { FirebaseModule } from './firebase/firebase.module';
import { ExpensesModule } from './expenses/expenses.module';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [
    FirebaseModule,
    UsersModule,
    ExpensesModule,
    CardsModule,
  ],
})
export class AppModule {}
