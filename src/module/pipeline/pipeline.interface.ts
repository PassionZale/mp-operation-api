import { CreateDeployLogRequestDto } from './dto/request/create-deploy-log.request.dto';
import { CreatePipeLineRequestDto } from './dto/request/create-pipeline.request.dto';

export interface CreatePipeLineServiceDto extends CreatePipeLineRequestDto {
  created_by: number;
}

export interface CreateDeployLogServiceDto extends CreateDeployLogRequestDto {
  pipeline_id: string;
  deployed_by: number;
}
