import type React from "react";
import { useMemo } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Home,
  Layers3,
  Users,
  Settings,
  Bell,
  Search as SearchIcon,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser, useLogout } from "@/modules/auth/hooks/useAuth";

function getUserDisplayName(user: any): string {
  if (!user) return "";

  const compositeName = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  const rawName =
    user?.full_name ||
    user?.name ||
    (compositeName.length ? compositeName : undefined) ||
    user?.username;

  if (rawName && String(rawName).trim().length > 0) {
    return String(rawName).trim();
  }

  if (user?.email) {
    return String(user.email).split("@")[0] ?? "";
  }

  return "";
}

function getUserInitials(user: any): string {
  const displayName = getUserDisplayName(user);
  if (!displayName) {
    return "AA";
  }

  const normalized = displayName
    .replace(/[_-]+/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .trim();

  const parts = normalized.split(/\s+/).filter(Boolean).slice(0, 2);

  if (parts.length === 0) {
    const fallback = displayName.replace(/[^A-Za-z0-9]/g, "");
    return fallback.slice(0, 2).toUpperCase() || "AA";
  }

  const initials = parts.map((part) => part.charAt(0).toUpperCase()).join("");

  if (initials.length >= 2) {
    return initials;
  }

  const lastPart = parts[parts.length - 1];
  if (lastPart.length > 1) {
    return (initials + lastPart.charAt(1).toUpperCase()).slice(0, 2);
  }

  if (displayName.length > 1) {
    return (initials + displayName.charAt(1).toUpperCase()).slice(0, 2);
  }

  return (initials + "A").slice(0, 2);
}

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;

  function onSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const q = String(data.get("q") ?? "").trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  const { data } = useCurrentUser();
  const logout = useLogout();

  const userDisplayName = useMemo(() => getUserDisplayName(data), [data]);
  const userInitials = useMemo(() => getUserInitials(data), [data]);

  return (
    <SidebarProvider>
      <AppLayoutInner
        children={children}
        navigate={navigate}
        isActive={isActive}
        onSearchSubmit={onSearchSubmit}
        data={data}
        logout={logout}
        userDisplayName={userDisplayName}
        userInitials={userInitials}
      />
    </SidebarProvider>
  );
};

const AppLayoutInner = ({ children, navigate, isActive, onSearchSubmit, data, logout, userDisplayName, userInitials }: any) => {
  const { setOpenMobile } = useSidebar();

  return (
    <>
      <Sidebar collapsible="icon" variant="sidebar">
        <SidebarHeader>
          <div className="px-2 py-1.5 font-semibold text-sm tracking-wide">
            LFPERP
          </div>
          <div className="px-2">
            <form onSubmit={onSearchSubmit} className="relative">
              <Input name="q" placeholder="Search…" className="h-8 pr-8" />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-2 top-1.5 text-muted-foreground hover:text-foreground"
              >
                <SearchIcon className="h-4 w-4" />
              </button>
            </form>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/")}
                  tooltip="Dashboard"
                  onClick={() => setOpenMobile(false)}
                >
                  <Link to="/">
                    <Home /> <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/orders")}
                  tooltip="Orders"
                  onClick={() => setOpenMobile(false)}
                >
                  <Link to="/orders">
                    <Layers3 /> <span>Orders</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/customers")}
                  tooltip="Customers"
                  onClick={() => setOpenMobile(false)}
                >
                  <Link to="/customers">
                    <Users /> <span>Customers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/users")}
                  tooltip="Users"
                  onClick={() => setOpenMobile(false)}
                >
                  <Link to="/admin/users">
                    <Users /> <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/component")}
                  tooltip="Components"
                  onClick={() => setOpenMobile(false)}
                >
                  <Link to="/component">
                    <Layers3 /> <span>Components</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarSeparator />
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/settings")}
                  tooltip="Preferences"
                  onClick={() => setOpenMobile(false)}
                >
                  <Link to="/settings">
                    <Settings /> <span>Preferences</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container max-w-screen-2xl flex h-14 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <div className="text-sm font-medium">ERP Dashboard</div>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Notifications"
                  >
                    <Bell className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={10}
                  className="w-72 rounded-xl border bg-popover text-popover-foreground shadow-xl"
                >
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-60 overflow-auto">
                    <div className="px-2 py-1.5 text-sm">
                      <div className="font-medium">New order received</div>
                      <div className="text-muted-foreground">
                        Order SO-1245 from Acme Inc.
                      </div>
                    </div>
                    <Separator className="my-1" />
                    <div className="px-2 py-1.5 text-sm">
                      <div className="font-medium">Inventory low</div>
                      <div className="text-muted-foreground">
                        SKU-334 is below threshold.
                      </div>
                    </div>
                    <Separator className="my-1" />
                    <div className="px-2 py-1.5 text-sm">
                      <div className="font-medium">Payment received</div>
                      <div className="text-muted-foreground">
                        Invoice INV-889 cleared.
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <ThemeSwitcher />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 rounded-full h-8 w-8">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={10}
                  className="w-56 rounded-xl border bg-popover text-popover-foreground shadow-xl"
                >
                  <DropdownMenuLabel className="space-y-1">
                    <div className="text-xs uppercase text-muted-foreground">
                      Signed in as
                    </div>
                    <div className="text-sm font-medium leading-none">
                      {userDisplayName || data?.email || "User"}
                    </div>
                    {data?.email ? (
                      <div className="text-xs text-muted-foreground">
                        {data.email}
                      </div>
                    ) : null}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/auth/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/auth/change-password">Change password</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      logout
                        .mutateAsync()
                        .finally(() => navigate("/auth/login"))
                    }
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="container max-w-screen-2xl py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="border-t mt-8">
          <div className="container max-w-screen-2xl py-6 px-4 sm:px-6 lg:px-8 text-xs text-muted-foreground flex items-center justify-between">
            <span>© {new Date().getFullYear()} LFPERP</span>
            <span>v1.0</span>
          </div>
        </footer>
      </SidebarInset>
    </>
  );
};
