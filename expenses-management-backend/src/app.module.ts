import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FirebaseModule } from './firebase/firebase.module';
import { ExpensesModule } from './expenses/expenses.module';
import { CardsModule } from './cards/cards.module';
import { SavingsModule } from './savings/savings.module';

@Module({
  imports: [
    FirebaseModule,
    UsersModule,
    ExpensesModule,
    CardsModule,
    SavingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
