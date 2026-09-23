"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { m } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { PulseLogo } from "@/components/brand/pulse-logo";
import { PulseIcon } from "@/components/brand/pulse-icon";

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "text-destructive" };
  if (score <= 3) return { score, label: "Medium", color: "text-warning" };
  return { score, label: "Strong", color: "text-success" };
}

const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 8, label: "At least 8 characters" },
  { test: (p: string) => /[A-Z]/.test(p), label: "One uppercase letter" },
  { test: (p: string) => /[0-9]/.test(p), label: "One number" },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p), label: "One special character" },
];

export default function SignupPage() {
  const { signup } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      toast("Please fill in all fields", "error");
      return;
    }
    if (password !== confirmPassword) {
      toast("Passwords do not match", "error");
      return;
    }
    if (!agreed) {
      toast("Please agree to the terms", "error");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    const result = signup(name, email, password);
    setLoading(false);

    if (result.success) {
      toast("Account created! Let's set up your profile.", "success");
      router.push("/onboarding");
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
          <div className="absolute top-32 right-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-16 left-16 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
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
          <h1 className="text-3xl font-bold mb-3">Start Your Journey</h1>
          <p className="text-white/80 max-w-sm">
            Create your free account and start tracking your fitness today.
            No credit card required.
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
            <h2 className="text-2xl font-bold text-foreground">Create account</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Join for free. Track your fitness journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />

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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Password strength */}
            {password && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        strength.score <= 1
                          ? "bg-destructive"
                          : strength.score <= 3
                          ? "bg-warning"
                          : "bg-success"
                      }`}
                      style={{ width: `${(strength.score / 5) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${strength.color}`}>
                    {strength.label}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {PASSWORD_RULES.map((rule) => (
                    <div
                      key={rule.label}
                      className="flex items-center gap-1 text-xs text-muted-foreground"
                    >
                      {rule.test(password) ? (
                        <Check className="h-3 w-3 text-success" />
                      ) : (
                        <X className="h-3 w-3 text-muted-foreground/50" />
                      )}
                      {rule.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              error={
                confirmPassword && password !== confirmPassword
                  ? "Passwords do not match"
                  : undefined
              }
              autoComplete="new-password"
            />

            <label className="flex items-start gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="rounded border-border mt-0.5"
              />
              <span>
                I agree to the{" "}
                <button type="button" className="text-primary hover:underline">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button type="button" className="text-primary hover:underline">
                  Privacy Policy
                </button>
              </span>
            </label>

            <Button
              type="submit"
              variant="gradient"
              className="w-full"
              loading={loading}
            >
              Create Account
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
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
