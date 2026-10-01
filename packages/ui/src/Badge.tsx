import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'green' | 'red' | 'blue' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gold',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full select-none';

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  }[size];

  const variantStyles = {
    gold: 'bg-[#FFF9EE] text-[#B45309] border border-[#F2D27A]/60 font-semibold',
    green: 'bg-[#ECFDF5] text-[#15803D] border border-[#A7F3D0]',
    red: 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]',
    blue: 'bg-[#EFF6FF] text-[#1E4BA8] border border-[#BFDBFE]',
    neutral: 'bg-gray-100 text-[#4A5163] border border-gray-200',
  }[variant];

  return (
    <span className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </span>
  );
};
