"use client";
import { useActionState } from "react";
import { ShieldCheck } from "lucide-react";
import { login } from "../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <Card>
      <CardHeader>
        <ShieldCheck className="size-8 text-primary" />
        <CardTitle>অ্যাডমিন লগইন</CardTitle>
        <CardDescription>মসজিদের জামাতের সময় পরিবর্তন করতে লগইন করুন।</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">ইউজারনেম</Label>
            <Input id="username" name="username" autoComplete="username" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">পাসওয়ার্ড</Label>
            <Input id="password" name="password" type="password" autoComplete="current-password" required />
          </div>
          {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "অপেক্ষা করুন…" : "লগইন"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
