import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="glass-strong rounded-2xl border border-border p-8 max-w-md w-full text-center">
        <div className="h-14 w-14 mx-auto mb-6 rounded-full bg-success/15 flex items-center justify-center">
          <CheckCircle className="h-7 w-7 text-success" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Payment successful
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Thanks for upgrading! Your plan is activating — it may take a few
          seconds. Manage payment methods anytime from Profile → Billing.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/dashboard">
            <Button variant="gradient" className="w-full">
              Go to dashboard
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline" className="w-full">
              View billing
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
