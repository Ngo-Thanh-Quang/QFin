import { IsNotEmpty, IsNumberString, IsOptional, IsIn, IsString } from 'class-validator';

export class CreateExpenseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  // amount as string on client (with thousand separators) — convert in service
  @IsNotEmpty()
  @IsNumberString()
  amount: string;

  @IsOptional()
  @IsString()
  currency?: string = 'VND';

  @IsIn(['expense', 'income'])
  type: 'expense' | 'income';

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  categoryName?: string;

  @IsOptional()
  @IsString()
  date?: string;
}
