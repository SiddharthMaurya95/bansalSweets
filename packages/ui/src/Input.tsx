import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-[#1B1F2A]">
            {label}
            {props.required && <span className="text-[#C8102E] ml-0.5">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[#4A5163] pointer-events-none">{leftIcon}</div>
          )}

          <input
            id={inputId}
            ref={ref}
            className={`w-full text-sm rounded-[8px] border transition-colors duration-150 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              leftIcon ? 'pl-9' : ''
            } ${rightIcon ? 'pr-9' : ''} ${
              error
                ? 'border-[#C8102E] focus:ring-[#C8102E]/30 text-[#C8102E]'
                : 'border-gray-300 focus:border-[#0B2A6B] focus:ring-[#0B2A6B]/20 text-[#1B1F2A]'
            } ${className}`}
            {...props}
          />

          {rightIcon && <div className="absolute right-3 text-[#4A5163]">{rightIcon}</div>}
        </div>

        {error && <span className="text-xs text-[#C8102E] mt-0.5">{error}</span>}
        {!error && helperText && (
          <span className="text-xs text-[#4A5163] mt-0.5">{helperText}</span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
