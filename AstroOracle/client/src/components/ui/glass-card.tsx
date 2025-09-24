import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "primary" | "secondary" | "accent";
  hover?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", hover = false, children, ...props }, ref) => {
    const baseClasses = "backdrop-blur-xl border rounded-xl transition-all duration-300";
    
    const variants = {
      default: "glass-card",
      primary: "glass-card border-primary/10 shadow-lg shadow-primary/5",
      secondary: "glass-card border-secondary/10 shadow-lg shadow-secondary/5", 
      accent: "glass-card border-accent/10 shadow-lg shadow-accent/5",
    };

    const hoverEffects = hover ? "hover:scale-[1.02] hover:shadow-2xl hover:backdrop-blur-2xl" : "";

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          hoverEffects,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
