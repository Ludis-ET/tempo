import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SearchPage() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q") ?? "";

  const results = useMemo(() => {
    // Placeholder for actual search logic
    if (!q) return [] as { id: number; title: string; description: string }[];
    return [
      { id: 1, title: `Result for "${q}"`, description: "No backend connected. This is a demo result." },
      { id: 2, title: `Another match: ${q}`, description: "Hook up your API to show real results." },
    ];
  }, [q]);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
          <CardDescription>Showing results for: {q ? <span className="font-medium">{q}</span> : "(empty)"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {results.length === 0 ? (
            <div className="text-sm text-muted-foreground">Type a query in the header search to see results.</div>
          ) : (
            <ul className="divide-y rounded-md border">
              {results.map((r) => (
                <li key={r.id} className="p-3 hover:bg-accent/50">
                  <div className="font-medium">{r.title}</div>
                  <div className="text-sm text-muted-foreground">{r.description}</div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
