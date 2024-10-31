import { FieldErrors } from 'react-hook-form';

type TFormErrorProps = {
  errors: FieldErrors;
  name: string;
};

export const FormError = ({ errors, name }: TFormErrorProps) => {
  const error = errors[name]?.message as string;

  return error ? <p className="text-red-500 text-sm mt-1">{error}</p> : null;
};
