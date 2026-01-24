import { IsIn, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateCardDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{16}$/)
  cardNumber: string;

  @IsNotEmpty()
  @IsString()
  bank: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['credit', 'debit'])
  cardType: 'credit' | 'debit';

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}$/)
  expiry: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{3}$/)
  cvv: string;
}
