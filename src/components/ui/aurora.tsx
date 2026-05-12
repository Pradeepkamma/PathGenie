import { cn } from "@/lib/utils";

interface AuroraProps {
  className?: string;
  variant?: "hero" | "subtle";
}

const Aurora = ({ className, variant = "hero" }: AuroraProps) => {
  const opacity = variant === "hero" ? "opacity-70" : "opacity-40";
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className={cn("absolute -top-40 -left-32 w-[600px] h-[600px] rounded-full blur-3xl animate-aurora", opacity)}
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.4), transparent 70%)" }} />
      <div className={cn("absolute top-20 -right-32 w-[500px] h-[500px] rounded-full blur-3xl animate-aurora", opacity)}
        style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.35), transparent 70%)", animationDelay: "5s" }} />
      <div className={cn("absolute -bottom-40 left-1/3 w-[700px] h-[700px] rounded-full blur-3xl animate-aurora", opacity)}
        style={{ background: "radial-gradient(circle, hsl(var(--primary-glow) / 0.35), transparent 70%)", animationDelay: "10s" }} />
    </div>
  );
};

export default Aurora;
