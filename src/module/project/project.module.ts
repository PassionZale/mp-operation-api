import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectController } from "./project.controller";
import { ProjectEntity } from "./project.entity";
import { ProjectService } from "./project.service";

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity])],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}