import { isUUID } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export const getAndValidateIds = (ids: string) => {
  const idsArray = ids.split(',');
  const isIdsValid = idsArray.every((id: string) => isUUID(id));

  if (!isIdsValid) {
    throw new BadRequestException('Invalid UUID format.');
  }

  return idsArray;
};
