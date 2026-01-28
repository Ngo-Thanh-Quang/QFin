import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class UpdateIncomeDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  incomeAmount: number;
}
