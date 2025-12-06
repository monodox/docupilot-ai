import * as React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600',
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };