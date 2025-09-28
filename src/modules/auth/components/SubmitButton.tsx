import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";

export function SubmitButton({ loading, children, className }: { loading?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <Button type="submit" className={className} disabled={loading}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {children}
    </Button>
  );
}
