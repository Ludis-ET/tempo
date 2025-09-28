import { Navigate, useLocation } from "react-router-dom";
import React from "react";
import { tokenStorage } from "@/modules/auth/storage";
import { useCurrentUser } from "@/modules/auth/hooks/useAuth";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  const { access } = tokenStorage.get();
  const shouldCheck = !access;
  const { data, isLoading } = useCurrentUser();

  if (shouldCheck) {
    if (isLoading) {
      return (
        <div className="w-full h-[50vh] grid place-items-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      );
    }
    if (!data) {
      return <Navigate to={{ pathname: "/auth/login" }} state={{ from: loc }} replace />;
    }
  }

  return <>{children}</>;
}
