import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputField } from "@/components/ui/input-field";
import { Combobox } from "@/components/ui/combobox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { toast } from "sonner";

interface Order { id: number; orderNo: string; customer: string; amount: number; status: "Pending" | "Shipped" | "Delivered" | "Cancelled" }

const sampleOrders: Order[] = Array.from({ length: 42 }).map((_, i) => ({
  id: i + 1,
  orderNo: `SO-${1000 + i}`,
  customer: ["Acme Inc.", "Globex", "Umbrella", "Initech"][i % 4],
  amount: Math.round((Math.random() * 900 + 100) * 100) / 100,
  status: ["Pending", "Shipped", "Delivered", "Cancelled"][i % 4] as Order["status"],
}));

export default function Index() {
  const [combo, setCombo] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const orderColumns: ColumnDef<Order>[] = [
    { key: "orderNo", header: "Order #", sortable: true },
    { key: "customer", header: "Customer", sortable: true },
    { key: "amount", header: "Amount", sortable: true, cell: (r) => `$${r.amount.toFixed(2)}` },
    { key: "status", header: "Status", sortable: true },
  ];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Demonstration of reusable, theme-aware UI components.</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <InputField label="Email" type="email" placeholder="name@company.com" description="We'll never share your email." />
            <InputField label="Password" type="password" placeholder="••••••••" success="Strong password" />
            <div>
              <label className="mb-1.5 block text-sm font-medium">Searchable Select</label>
              <Combobox
                value={combo}
                onChange={(v) => setCombo(v)}
                options={[{ label: "Sales", value: "sales" }, { label: "Inventory", value: "inventory" }, { label: "Finance", value: "finance" }, { label: "HR", value: "hr" }]}
                placeholder="Choose a module"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={() => toast.success("Saved successfully")}>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Danger</Button>
              <Button variant="outline" disabled>
                Disabled
              </Button>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Open Modal</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sample Dialog</DialogTitle>
                  <DialogDescription>Modal with header, body and footer.</DialogDescription>
                </DialogHeader>
                <div className="text-sm text-muted-foreground">Use this dialog to confirm actions or display forms.</div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={() => { setOpen(false); toast.info("Confirmed"); }}>Confirm</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Alert variants for state feedback.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Alert>
              <AlertTitle>Info</AlertTitle>
              <AlertDescription>System maintenance scheduled tonight.</AlertDescription>
            </Alert>
            <Alert className="border-success/50 text-success">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Operation completed successfully.</AlertDescription>
            </Alert>
            <Alert className="border-warning/50 text-warning">
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>Inventory threshold reached.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Failed to sync with server.</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Authentication (Testing)</CardTitle>
            <CardDescription>Quick links to auth pages for QA.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild><a href="/auth/login">Go to Sign in</a></Button>
            <Button asChild variant="secondary"><a href="/auth/register">Create account</a></Button>
            <Button asChild variant="outline"><a href="/auth/forgot">Reset password</a></Button>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Sortable, paginated, selectable table.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable<Order>
              columns={orderColumns}
              data={sampleOrders}
              caption="Orders overview"
              onSelectionChange={() => {}}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
