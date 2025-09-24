import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import { forwardRef } from "react";

export interface NeonButtonProps extends ButtonProps {
  variant?: "primary" | "secondary" | "accent" | "gradient";
  glow?: boolean;
  pulse?: boolean;
}

const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, variant = "gradient", glow = true, pulse = false, children, ...props }, ref) => {
    const baseClasses = "font-semibold transition-all duration-300 transform hover:scale-105";
    
    const variants = {
      primary: "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50",
      secondary: "bg-secondary text-secondary-foreground shadow-lg shadow-secondary/30 hover:shadow-secondary/50",
      accent: "bg-accent text-accent-foreground shadow-lg shadow-accent/30 hover:shadow-accent/50",
      gradient: "neon-button text-primary-foreground",
    };

    const glowEffect = glow ? "hover:shadow-2xl" : "";
    const pulseEffect = pulse ? "animate-pulse-neon" : "";

    return (
      <Button
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          glowEffect,
          pulseEffect,
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

NeonButton.displayName = "NeonButton";

export { NeonButton };
