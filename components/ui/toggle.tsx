'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// toggleVariants は、トグルボタンのバリアントを生成します。
const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-white text-black border-gray-300',
        outline: 'bg-transparent border border-gray-500',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 py-1',
        lg: 'h-12 px-5 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type ToggleProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof toggleVariants>;

/**
 * Toggle コンポーネントは、スタイリング済みのボタンコンポーネントです。
 */
const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(toggleVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Toggle.displayName = 'Toggle';

export { Toggle, toggleVariants };
