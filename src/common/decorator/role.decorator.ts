import { SetMetadata, CustomDecorator } from '@nestjs/common';
import { ROLE_GUARD_OPTIONS } from '@src/common/constant/meta.constant';

export const Role = (role: number): CustomDecorator => SetMetadata(ROLE_GUARD_OPTIONS, role);