import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'flat' | 'warm' | 'bordered';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  hoverable = true,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-[14px] transition-all duration-200';

  const variantStyles = {
    elevated: 'bg-white shadow-[0_4px_20px_rgba(11,42,107,0.06)] border border-gray-100',
    flat: 'bg-white border border-gray-200',
    warm: 'bg-[#FFF9EE] border border-[#F2D27A]/50 shadow-sm',
    bordered: 'bg-white border-2 border-gray-200',
  }[variant];

  const hoverStyles = hoverable
    ? 'hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(11,42,107,0.12)]'
    : '';

  return (
    <div className={`${baseStyles} ${variantStyles} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};
