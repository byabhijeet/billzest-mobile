import React from 'react';
import StatusBadge, { StatusType } from './StatusBadge';

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning';

const variantToStatus: Record<BadgeVariant, StatusType> = {
  default: 'default',
  secondary: 'secondary',
  outline: 'outline',
  destructive: 'destructive',
  success: 'success',
  warning: 'warning',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
}) => {
  return (
    <StatusBadge
      status={variantToStatus[variant]}
      label={typeof children === 'string' ? children : ''}
      size="sm"
    />
  );
};

export default Badge;
