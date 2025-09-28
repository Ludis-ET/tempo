import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { useForm } from "react-hook-form";

export default function ComponentsPage() {
  const { register } = useForm();
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>Examples of primary and variants.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2 flex-wrap">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
          <CardDescription>Labeled fields with validation styles.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <InputField label="Email" type="email" placeholder="you@company.com" {...register("email")} />
          <InputField label="Password" type="password" placeholder="••••••••" {...register("password")} />
        </CardContent>
      </Card>
    </div>
  );
}
