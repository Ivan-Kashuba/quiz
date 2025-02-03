import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faCircleQuestion,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

export const StatusIcon = ({ isSuccess }: { isSuccess?: boolean | null }) => {
  let icon;
  let colorClass;

  if (isSuccess === null) {
    icon = faCircleQuestion;
    colorClass = 'text-gray-500';
  } else if (isSuccess) {
    icon = faCheckCircle;
    colorClass = 'text-green-500';
  } else {
    icon = faTimesCircle;
    colorClass = 'text-red-500';
  }

  return <FontAwesomeIcon icon={icon} className={colorClass} />;
};
