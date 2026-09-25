"use client";

import { useState, type FormEvent } from "react";
import { Sparkles, CheckCircle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProWaitlist } from "@/hooks/useProWaitlist";

interface ProWaitlistModalProps {
  open: boolean;
  onClose: () => void;
}

export function ProWaitlistModal({ open, onClose }: ProWaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { joined, join } = useProWaitlist();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const result = join(email);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setSuccess(true);
  };

  const handleClose = () => {
    onClose();
    // Reset after close animation
    window.setTimeout(() => {
      setSuccess(false);
      setError("");
      setEmail("");
    }, 300);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={success || joined ? "You're on the list!" : "Join the Pro waitlist"}
      description={
        success || joined
          ? undefined
          : "Be first in line when PULSE Pro launches. No spam — just one launch email."
      }
      className="max-w-md"
    >
      {success || joined ? (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
            <CheckCircle className="h-7 w-7" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold text-foreground">You&apos;re on the Pro waitlist</p>
            <p className="mt-1 text-sm text-muted-foreground">
              We&apos;ll notify you the moment Pro is ready.
            </p>
          </div>
          <Button type="button" variant="gradient" onClick={handleClose} className="w-full">
            Continue
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            error={error || undefined}
            autoComplete="email"
            aria-label="Email for Pro waitlist"
          />
          <Button
            type="submit"
            variant="gradient"
            className="w-full"
            aria-label="Join Pro waitlist"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Join Waitlist
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Pro is coming soon — marketing only for now, no payment required.
          </p>
        </form>
      )}
    </Modal>
  );
}
