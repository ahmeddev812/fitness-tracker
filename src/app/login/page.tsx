"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { m } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { PulseLogo } from "@/components/brand/pulse-logo";
import { PulseIcon } from "@/components/brand/pulse-icon";

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast("Please fill in all fields", "error");
      return;
    }

    setLoading(true);
    // Small delay for UX feel
    await new Promise((r) => setTimeout(r, 300));
    const result = login(email, password);
    setLoading(false);

    if (result.success) {
      toast(result.message, "success");
      router.push("/dashboard");
    } else {
      toast(result.message, "error");
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left: Brand showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center gradient-primary">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-20 right-20 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        </div>
        <m.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative text-center text-white p-12"
        >
          <div className="h-16 w-16 mx-auto mb-6 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <PulseIcon className="h-9 w-9" tone="white" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Welcome Back</h1>
          <p className="text-white/80 max-w-sm">
            Continue your fitness journey. Track workouts, nutrition, and
            progress — all data stays on your device.
          </p>
        </m.div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <m.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <PulseLogo size="md" />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Sign in</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Welcome back! Sign in to continue tracking.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input
                  type="checkbox"
                  className="rounded border-border"
                  defaultChecked
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => toast("Password reset coming soon!", "info")}
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="gradient"
              className="w-full"
              loading={loading}
            >
              Sign In
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => toast("Google sign-in coming soon!", "info")}
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>

          <div className="mt-6 p-3 rounded-lg bg-info/10 border border-info/20">
            <p className="text-xs text-info text-center">
              This is a demo. All data is stored locally in your browser.
            </p>
          </div>
        </m.div>
      </div>
    </div>
  );
}
