import { IsOptional } from 'class-validator';

export class SelectPipeLineRequestDto {
  @IsOptional()
  project_id?: number;
}
