import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
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
                path="/components"
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
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
