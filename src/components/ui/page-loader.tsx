import { Loader2 } from "lucide-react";

interface PageLoaderProps {
  message?: string;
  className?: string;
}

export function PageLoader({
  message = "Loading...",
  className = "",
}: PageLoaderProps) {
  return (
    <div
      className={`grid h-screen w-full place-items-center text-muted-foreground ${className}`}
    >
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}
