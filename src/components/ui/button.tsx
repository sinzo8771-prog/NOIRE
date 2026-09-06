import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-xs uppercase tracking-widest-editorial transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-copper disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-ivory text-cacao-950 hover:bg-[#E2D2B5] active:scale-[0.98]",
        copper:
          "bg-copper-surface text-ivory hover:bg-copper-hover active:scale-[0.98]",
        outline:
          "border border-cacao-700 bg-transparent text-ivory hover:border-copper hover:bg-cacao-850 hover:text-ivory",
        ghost:
          "text-ivory/70 hover:text-ivory hover:bg-cacao-850/60",
        link:
          "text-ivory underline-offset-4 hover:underline hover:text-copper-text",
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
