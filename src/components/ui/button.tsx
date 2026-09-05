import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-xs uppercase tracking-widest-editorial transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#9B6742] disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#F3E8D3] text-[#080604] hover:bg-[#E2D2B5] active:scale-[0.98]",
        copper:
          "bg-[#9B6742] text-[#F3E8D3] hover:bg-[#835534] active:scale-[0.98]",
        outline:
          "border border-[#342015] bg-transparent text-[#F3E8D3] hover:border-[#9B6742] hover:bg-[#1A100B] hover:text-[#F3E8D3]",
        ghost:
          "text-[#F3E8D3]/70 hover:text-[#F3E8D3] hover:bg-[#1A100B]/60",
        link:
          "text-[#F3E8D3] underline-offset-4 hover:underline hover:text-[#9B6742]",
      },
      size: {
        default: "h-11 px-7 py-3 rounded-[2px]",
        sm: "h-9 px-4 text-[10px] rounded-[2px]",
        lg: "h-12 px-9 py-4 text-xs rounded-[2px]",
        icon: "h-10 w-10 rounded-[2px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
