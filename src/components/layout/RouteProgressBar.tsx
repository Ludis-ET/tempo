import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useLocation, type Location } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

type RouteTransitionRenderState = {
  displayLocation: Location;
  isTransitioning: boolean;
  isInitialTransition: boolean;
};

type RouteTransitionProviderProps = {
  children: (state: RouteTransitionRenderState) => ReactNode;
};

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  easing: "ease",
  speed: 400,
  minimum: 0.1,
});

export function RouteTransitionProvider({
  children,
}: RouteTransitionProviderProps) {
  const location = useLocation();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const [displayLocation, setDisplayLocation] = useState(location);
  const [pendingLocation, setPendingLocation] = useState<Location | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isInitialTransition, setIsInitialTransition] = useState(true);

  const hasMountedRef = useRef(false);
  const transitionTimeoutRef = useRef<number | null>(null);

  const clearTransitionTimeout = () => {
    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
  };

  useLayoutEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      if (!NProgress.isStarted()) {
        NProgress.start();
      }
      return;
    }

    if (location.key !== displayLocation.key) {
      setPendingLocation(location);
      setIsTransitioning(true);
      if (!NProgress.isStarted()) {
        NProgress.start();
      }
    }
  }, [location, displayLocation]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      return;
    }

    if (!isTransitioning) {
      return;
    }

    if (isFetching > 0 || isMutating > 0) {
      if (!NProgress.isStarted()) {
        NProgress.start();
      }
      return;
    }

    clearTransitionTimeout();

    transitionTimeoutRef.current = window.setTimeout(() => {
      setDisplayLocation((prev) => pendingLocation ?? prev);
      setPendingLocation(null);
      setIsTransitioning(false);
      if (isInitialTransition) {
        setIsInitialTransition(false);
      }
      NProgress.done();
    }, 250);

    return clearTransitionTimeout;
  }, [
    isTransitioning,
    isFetching,
    isMutating,
    pendingLocation,
    isInitialTransition,
  ]);

  useEffect(() => {
    return () => {
      clearTransitionTimeout();
      NProgress.remove();
    };
  }, []);

  const state = useMemo(
    () => ({
      displayLocation,
      isTransitioning,
      isInitialTransition,
    }),
    [displayLocation, isTransitioning, isInitialTransition]
  );

  return <>{children(state)}</>;
}

export function RouteProgressOverlay({
  isTransitioning,
  isInitialTransition,
}: {
  isTransitioning: boolean;
  isInitialTransition: boolean;
}) {
  if (!isTransitioning || !isInitialTransition) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="rounded-lg border bg-background px-6 py-4 shadow-lg">
        <p className="text-sm font-medium text-muted-foreground">
          Loading your workspace…
        </p>
      </div>
    </div>
  );
}
