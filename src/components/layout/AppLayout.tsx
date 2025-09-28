import type React from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarSeparator, SidebarTrigger } from "@/components/ui/sidebar";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Home, Layers3, Users, Settings, Bell, Search as SearchIcon } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser, useLogout } from "@/modules/auth/hooks/useAuth";

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

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="sidebar">
        <SidebarHeader>
          <div className="px-2 py-1.5 font-semibold text-sm tracking-wide">NovaERP</div>
          <div className="px-2">
            <form onSubmit={onSearchSubmit} className="relative">
              <Input name="q" placeholder="Search…" className="h-8 pr-8" />
              <button type="submit" aria-label="Search" className="absolute right-2 top-1.5 text-muted-foreground hover:text-foreground">
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
                <SidebarMenuButton asChild isActive={isActive("/")}>
                  <Link to="/"><Home /> <span>Dashboard</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/orders")}>
                  <Link to="/orders"><Layers3 /> <span>Orders</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/customers")}>
                  <Link to="/customers"><Users /> <span>Customers</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/users")}>
                  <Link to="/admin/users"><Users /> <span>Users</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/components")}>
                  <Link to="/components"><Layers3 /> <span>Components</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarSeparator />
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/settings")}>
                  <Link to="/settings"><Settings /> <span>Preferences</span></Link>
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
                  <Button variant="ghost" size="icon" aria-label="Notifications">
                    <Bell className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-60 overflow-auto">
                    <div className="px-2 py-1.5 text-sm">
                      <div className="font-medium">New order received</div>
                      <div className="text-muted-foreground">Order SO-1245 from Acme Inc.</div>
                    </div>
                    <Separator className="my-1" />
                    <div className="px-2 py-1.5 text-sm">
                      <div className="font-medium">Inventory low</div>
                      <div className="text-muted-foreground">SKU-334 is below threshold.</div>
                    </div>
                    <Separator className="my-1" />
                    <div className="px-2 py-1.5 text-sm">
                      <div className="font-medium">Payment received</div>
                      <div className="text-muted-foreground">Invoice INV-889 cleared.</div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <ThemeSwitcher />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 rounded-full h-8 w-8">
                    <Avatar className="h-8 w-8"><AvatarFallback>AA</AvatarFallback></Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Signed in as {data?.email ?? "user"}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/auth/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/auth/change-password">Change password</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout.mutateAsync().finally(() => navigate("/auth/login"))}>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="container max-w-screen-2xl py-6 px-4 sm:px-6 lg:px-8">{children}</main>
        <footer className="border-t mt-8">
          <div className="container max-w-screen-2xl py-6 px-4 sm:px-6 lg:px-8 text-xs text-muted-foreground flex items-center justify-between">
            <span>© {new Date().getFullYear()} NovaERP</span>
            <span>v1.0</span>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
};
