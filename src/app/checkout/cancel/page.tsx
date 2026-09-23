import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="glass-strong rounded-2xl border border-border p-8 max-w-md w-full text-center">
        <div className="h-14 w-14 mx-auto mb-6 rounded-full bg-warning/15 flex items-center justify-center">
          <XCircle className="h-7 w-7 text-warning" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Checkout cancelled
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          No charge was made. You can try again whenever you&apos;re ready.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/#pricing">
            <Button variant="gradient" className="w-full">
              Back to pricing
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
