import { Validator } from 'react-admin';

export const noOnlySpaces: Validator = (value) => {
  return value && value.trim().length === 0
    ? 'Cannot be only spaces'
    : undefined;
};
