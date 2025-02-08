"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          "px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90",
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

export const buttonVariants = (props?: { variant?: string }) => {
  // 例として、variantに応じたTailwindCSSのクラス文字列を返す実装
  switch (props?.variant) {
    case 'outline':
      return 'px-4 py-2 border rounded-md hover:bg-gray-100';
    case 'ghost':
      return 'px-4 py-2 bg-transparent hover:bg-gray-100';
    default:
      return 'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700';
  }
};