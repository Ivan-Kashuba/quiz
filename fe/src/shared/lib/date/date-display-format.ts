import { format } from 'date-fns';

export const getViewDateTime = (date: string | Date) => {
  return format(new Date(date), 'dd.MM.yyyy HH:mm');
};
