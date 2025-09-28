import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUsers } from "@/modules/auth/hooks/useAuth";

export default function UsersPage() {
  const { data, isLoading, error } = useUsers();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <div className="text-sm text-muted-foreground">Loading…</div>}
        {error && <div className="text-sm text-destructive">{(error as Error).message}</div>}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Full name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Position</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data?.results ?? []).map((u: any, idx: number) => (
              <TableRow key={idx}>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.full_name ?? `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim()}</TableCell>
                <TableCell>{u.department}</TableCell>
                <TableCell>{u.position}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
