import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";

export default function AuthLayout({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-background via-background to-muted/60" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.35),_transparent_65%)]" />
      <div className="flex flex-1 flex-col px-6 py-10 sm:px-10">
        <div className="flex items-center justify-between">
          <div className="text-base font-semibold tracking-tight text-primary">LFPERP</div>
          <ThemeSwitcher />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-md border border-border/60 bg-background/95 shadow-2xl backdrop-blur">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-3xl font-semibold tracking-tight">{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-6">{children}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
