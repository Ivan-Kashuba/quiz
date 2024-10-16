import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const ApiDefaultNotFoundResponse = () => {
  return ApiNotFoundResponse({
    description: 'Resource is not found',
  });
};

export const ApiDefaultUnauthorizedResponse = () => {
  return ApiUnauthorizedResponse({
    description: 'Unauthorized',
  });
};

export const ApiDefaultNoContentResponse = () => {
  return ApiNoContentResponse({
    description: 'No content',
  });
};

export const ApiDefaultBadRequestResponse = () => {
  return ApiBadRequestResponse({
    description: 'Bad request',
  });
};
