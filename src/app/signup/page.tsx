"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs/legacy";
import { Eye, EyeOff, UserPlus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PulseLogo } from "@/components/brand/pulse-logo";

const REMEMBER_KEY = "fitness_remember_me";

function writeRememberMe(checked: boolean) {
  try {
    if (checked) {
      window.localStorage.setItem(REMEMBER_KEY, "1");
    } else {
      window.localStorage.removeItem(REMEMBER_KEY);
    }
  } catch {
    // ignore
  }
}

export default function SignupPage() {
  const router = useRouter();
  const { signUp, setActive, isLoaded } = useSignUp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false); // DEFAULT UNCHECKED
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [code, setCode] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;
    setError("");
    setLoading(true);
    try {
      const result = await signUp.create({
        emailAddress: email.trim(),
        password,
      });
      writeRememberMe(remember);

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/onboarding");
        return;
      }
      if (
        result.status === "missing_requirements" ||
        result.unverifiedFields.includes("email_address")
      ) {
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setNeedsVerification(true);
        return;
      }
      setError("Unable to create account. Try again.");
    } catch (err: unknown) {
      const clerkError = err as { errors?: { longMessage?: string; message?: string }[] };
      setError(
        clerkError.errors?.[0]?.longMessage ||
          clerkError.errors?.[0]?.message ||
          "Could not create account.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;
    setError("");
    setLoading(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/onboarding");
      } else {
        setError("Incorrect code. Try again.");
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: { longMessage?: string; message?: string }[] };
      setError(
        clerkError.errors?.[0]?.longMessage ||
          clerkError.errors?.[0]?.message ||
          "Verification failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-1/4 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 h-[300px] w-[300px] rounded-full bg-accent/8 blur-[80px]" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="flex justify-center mb-6">
          <Link href="/" aria-label="PULSE home">
            <PulseLogo size="md" />
          </Link>
        </div>

        <div className="glass-strong rounded-2xl border border-border p-6 sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Start tracking in under a minute
            </p>
          </div>

          {needsVerification ? (
            <form onSubmit={handleVerify} className="space-y-4" noValidate>
              <p className="text-sm text-muted-foreground text-center">
                We sent a code to <span className="font-medium text-foreground">{email}</span>
              </p>
              <Input
                label="Verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                aria-label="Email verification code"
              />
              {error && (
                <p className="flex items-center gap-2 text-sm text-destructive" role="alert">
                  <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {error}
                </p>
              )}
              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                loading={loading}
                disabled={!code.trim()}
              >
                Verify & Continue
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input
                label="Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                aria-label="Email"
              />
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  aria-label="Password"
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-[38px] p-1 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={0}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => {
                    setRemember(e.target.checked);
                    writeRememberMe(e.target.checked);
                  }}
                  className="h-4 w-4 rounded border-input accent-primary focus-visible:ring-2 focus-visible:ring-ring"
                  aria-describedby="signup-remember-hint"
                />
                <span className="text-sm text-foreground">Remember me on this device</span>
              </label>
              <p id="signup-remember-hint" className="text-xs text-muted-foreground -mt-2">
                Keep me signed in for 30 days
              </p>

              {error && (
                <p className="flex items-center gap-2 text-sm text-destructive" role="alert">
                  <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {error}
                </p>
              )}

              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                loading={loading}
                disabled={!email.trim() || password.length < 8}
                aria-label="Create account"
              >
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Create Account
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
