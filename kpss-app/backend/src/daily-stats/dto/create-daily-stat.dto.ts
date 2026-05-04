import { IsInt, IsString, IsNumber, Min, Matches } from 'class-validator';

export class CreateDailyStatDto {
  @IsInt()
  subject_id: number;

  // YYYY-MM-DD formatında tarih beklenir
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be in YYYY-MM-DD format' })
  date: string;

  @IsInt()
  @Min(0, { message: 'solved_count negatif olamaz' })
  solved_count: number;

  @IsNumber()
  net: number;
}
