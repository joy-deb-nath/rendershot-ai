import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";

// Enhanced button variants for RenderShot AI
const enhancedButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        hero: "bg-gradient-premium text-primary-foreground hover:shadow-glow transform hover:scale-105 transition-all duration-300",
        premium: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-premium",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90",
        ghost: "hover:bg-accent/10 hover:text-accent",
        outline: "border border-input bg-background hover:bg-accent/10 hover:text-accent-foreground",
        glow: "bg-primary text-primary-foreground shadow-glow hover:shadow-premium transform hover:scale-105 transition-all duration-300",
      },
      size: {
        hero: "h-14 px-8 py-4 text-lg",
        lg: "h-11 rounded-md px-8",
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "default",
    },
  }
);

export interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "hero" | "premium" | "accent" | "ghost" | "outline" | "glow";
  size?: "hero" | "lg" | "default" | "sm" | "icon";
  asChild?: boolean;
}

export const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <Button
        className={enhancedButtonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);

EnhancedButton.displayName = "EnhancedButton";