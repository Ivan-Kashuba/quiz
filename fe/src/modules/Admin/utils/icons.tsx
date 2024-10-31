import { ComponentType } from 'react';
import { useLocation } from 'react-router-dom';

export function createStyledIcon(
  IconComponent: ComponentType<any>,
  resource: string
) {
  return () => {
    const { pathname } = useLocation();
    const isActive = pathname.startsWith(`/admin/${resource}`);
    const iconColor = isActive ? '#fff' : 'rgba(255, 255, 255, 0.7)';

    return <IconComponent color={iconColor} />;
  };
}
