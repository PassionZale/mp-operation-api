import { CreateDeployLogRequestDto } from "./dto/request/create-deploy-log.request.dto";

export interface IPipeLineDeployDto extends CreateDeployLogRequestDto {
  project_path: string;
}