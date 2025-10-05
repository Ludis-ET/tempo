import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCurrentUser } from "@/modules/auth/hooks/useAuth";
import { tokenStorage } from "@/modules/auth/storage";
import { PageLoader } from "@/components/ui/page-loader";

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const { access } = tokenStorage.get();
  const { data, isLoading, isError, error } = useCurrentUser();

  if (isLoading) {
    return <PageLoader message="Authenticating..." />;
  }

  if (!data) {
    if (!access || isError) {
      return (
        <Navigate
          to={{ pathname: "/auth/login" }}
          state={{
            from: location,
            error: error instanceof Error ? error.message : undefined,
          }}
          replace
        />
      );
    }
  }

  return <>{children}</>;
}
