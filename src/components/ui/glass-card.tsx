import { cn } from "@/lib/utils";
import { forwardRef, HTMLAttributes } from "react";

const GlassCard = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "glass rounded-2xl shadow-card transition-all duration-300 hover:shadow-elevated",
        className
      )}
      {...props}
    />
  )
);
GlassCard.displayName = "GlassCard";

export default GlassCard;
