import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PlaceholderPage from "./pages/PlaceholderPage";
import { Provider } from "react-redux";
import { store } from "./store";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AppLayout } from "@/components/layout/AppLayout";
import Login from "@/pages/auth/Login";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import SearchPage from "@/pages/Search";
import ProfilePage from "@/pages/auth/Profile";
import ChangePasswordPage from "@/pages/auth/ChangePassword";
import UsersPage from "@/pages/admin/Users";
import ComponentsPage from "@/pages/Components";
import { ProtectedRoute } from "@/modules/auth/routes/ProtectedRoute";
import AccountsListPage from "@/pages/customers/AccountsList";
import {
  RouteTransitionProvider,
  RouteProgressOverlay,
} from "@/components/layout/RouteProgressBar";
import { PageLoader } from "@/components/ui/page-loader";

const queryClient = new QueryClient();

const App = () => {
  // const isFetching = useIsFetching(); // Not used in current implementation
  // const isMutating = useIsMutating(); // Not used in current implementation

  // Check for any query errors during initial load
  const hasErrors = queryClient.getQueryCache().getAll().some((query: any) => query.state.status === 'error');

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <RouteTransitionProvider>
                {({ displayLocation, isTransitioning, isInitialTransition }) => (
                  <>
                    {isInitialTransition && (
                      <PageLoader
                        message={hasErrors ? "Loading failed. Please refresh the page." : "Loading application..."}
                      />
                    )}
                    {!isInitialTransition && hasErrors && (
                      <div className="fixed top-4 right-4 z-50 max-w-sm">
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            Some data failed to load. Please refresh the page.
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                    <Routes location={displayLocation}>
                    <Route path="/auth/login" element={<Login />} />
                    <Route
                      path="/auth/register"
                      element={<Navigate to="/auth/login" replace />}
                    />
                    <Route path="/auth/forgot" element={<ForgotPassword />} />

                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <Index />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/orders"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <PlaceholderPage
                              title="Orders"
                              description="Manage sales orders, statuses, and fulfillment."
                            />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/customers"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <AccountsListPage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/products"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <PlaceholderPage
                              title="Products"
                              description="Catalog, pricing, and variants."
                            />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/inventory"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <PlaceholderPage
                              title="Inventory"
                              description="Stock levels, warehouses, and movements."
                            />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/suppliers"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <PlaceholderPage
                              title="Suppliers"
                              description="Vendors and purchase orders."
                            />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/invoices"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <PlaceholderPage
                              title="Invoices"
                              description="Billing, payments, and AR."
                            />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/reports"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <PlaceholderPage
                              title="Reports"
                              description="KPIs and analytics dashboards."
                            />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <PlaceholderPage
                              title="Preferences"
                              description="Configure system settings and user preferences."
                            />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/search"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <SearchPage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/auth/profile"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <ProfilePage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/auth/change-password"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <ChangePasswordPage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/users"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <UsersPage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/component"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <ComponentsPage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="*"
                      element={
                        <AppLayout>
                          <NotFound />
                        </AppLayout>
                      }
                    />
                  </Routes>
                  <RouteProgressOverlay
                    isTransitioning={isTransitioning}
                    isInitialTransition={isInitialTransition}
                  />
                </>
              )}
            </RouteTransitionProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </Provider>
  );
};

export default App;
