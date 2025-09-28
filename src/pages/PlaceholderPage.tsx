import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PlaceholderPage({ title, description }: { title: string; description?: string }) {
  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description ?? "This page is a placeholder. Continue prompting to implement this screen."}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Content coming soon. The global navigation and theme are shared across all pages.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
