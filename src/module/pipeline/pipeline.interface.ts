import { CreateDeployLogRequestDto } from './dto/request/create-deploy-log.request.dto';
import { CreatePipeLineRequestDto } from './dto/request/create-pipeline.request.dto';

export interface CreatePipeLineServiceDto extends CreatePipeLineRequestDto {
  user_id: number;
}

export interface CreateDeployLogServiceDto extends CreateDeployLogRequestDto {
  user_id: number;
}
