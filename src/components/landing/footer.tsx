"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { Camera, Code, Mail, MessageCircle, Send, Users } from "lucide-react";
import { PulseLogo } from "@/components/brand/pulse-logo";
import { useConfettiBurst } from "@/hooks/useConfetti";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Live demo", href: "#demo" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help center", href: "#" },
      { label: "Exercise library", href: "#" },
      { label: "Blog", href: "#" },
      { label: "API docs", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press kit", href: "#" },
      { label: "Contact", href: "mailto:hello@pulse.app" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Security", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
] as const;

const SOCIALS = [
  { label: "Twitter", href: "#", Icon: MessageCircle },
  { label: "Instagram", href: "#", Icon: Camera },
  { label: "LinkedIn", href: "#", Icon: Users },
  { label: "GitHub", href: "#", Icon: Code },
] as const;

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { fireConfetti, confetti } = useConfettiBurst();

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    fireConfetti();
  };

  return (
    <footer className="relative border-t border-border/60 bg-card/40 backdrop-blur-sm">
      {confetti}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="glass -mt-10 mb-14 flex flex-col gap-6 rounded-3xl border border-border/60 p-7 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Stay in the loop
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Training tips and product updates. One email a month, no spam.
            </p>
          </div>
          <form
            onSubmit={subscribe}
            className="flex w-full max-w-md gap-2"
            aria-label="Newsletter signup"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-11 flex-1 rounded-xl border border-border/60 bg-background/70 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="submit"
              className="flex h-11 items-center gap-2 rounded-xl gradient-primary px-5 text-sm font-semibold text-white shadow-glow transition-opacity hover:opacity-90"
            >
              {subscribed ? (
                <>
                  <Send className="h-4 w-4" aria-hidden="true" /> Done
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" aria-hidden="true" /> Subscribe
                </>
              )}
            </button>
          </form>
        </m.div>

        <div className="grid gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <PulseLogo size="md" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              PULSE is a local-first fitness companion. Track workouts,
              nutrition, and hydration — your data never leaves your device.
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-border/60 py-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PULSE. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with ❤️ for people who show up. Every beat counts.
          </p>
        </div>
      </div>
    </footer>
  );
}
