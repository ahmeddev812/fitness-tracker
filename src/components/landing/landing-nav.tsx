"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { PulseLogo } from "@/components/brand/pulse-logo";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useAuth } from "@/hooks/useAuth";

const NAV_LINKS = [
  { label: "Preview", href: "#demo" },
  { label: "Features", href: "#features" },
  { label: "Journey", href: "#journey" },
  { label: "Stories", href: "#stories" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const SCROLL_OFFSET = 88;
const FLASH_MS = 1200;

function flashSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove("section-arrive");
  // reflow so animation restarts if same section clicked twice
  void el.offsetWidth;
  el.classList.add("section-arrive");
  window.setTimeout(() => el.classList.remove("section-arrive"), FLASH_MS);
}

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("demo");
  const { user, isAuthenticated, isLoading } = useAuth();

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string, after?: () => void) => {
      e.preventDefault();
      const id = href.replace(/^#/, "");
      const el = document.getElementById(id);
      if (!el) return;

      const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
      setActiveId(id);
      history.replaceState(null, "", href);
      after?.();

      // fire flash when scroll settles near the section
      const start = performance.now();
      let cancelled = false;
      const cancel = () => {
        cancelled = true;
        window.removeEventListener("wheel", cancel);
        window.removeEventListener("touchstart", cancel);
        window.removeEventListener("keydown", cancel);
      };
      window.addEventListener("wheel", cancel, { passive: true, once: true });
      window.addEventListener("touchstart", cancel, { passive: true, once: true });
      window.addEventListener("keydown", cancel, { once: true });

      const check = () => {
        if (cancelled) return;
        const y = Math.abs(window.scrollY - top);
        if (y < 4 || performance.now() - start > 1200) {
          flashSection(id);
          return;
        }
        requestAnimationFrame(check);
      };
      requestAnimationFrame(check);
    },
    []
  );

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const onScroll = () => {
      const line = window.scrollY + SCROLL_OFFSET + 24;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= line) {
          current = id;
        }
      }
      setActiveId(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <m.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 glass-strong border-b border-border/60"
    >
      <nav className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="PULSE home">
          <PulseLogo size="sm" iconClassName="h-8 w-8" />
        </Link>

        {/* Desktop nav — true center */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-5 lg:gap-8">
          {NAV_LINKS.map((link) => {
            const id = link.href.slice(1);
            const isActive = activeId === id;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative text-sm whitespace-nowrap transition-colors ${
                  isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
                aria-current={isActive ? "true" : undefined}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-0.5 rounded-full bg-primary transition-all duration-300 ${
                    isActive ? "w-full opacity-100" : "w-0 opacity-0"
                  }`}
                  aria-hidden="true"
                />
              </a>
            );
          })}
        </div>

        {/* Right: actions + mobile menu */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {isAuthenticated && user ? (
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-full hover:bg-accent/10 transition-colors p-1 pr-3"
                aria-label="Open profile"
              >
                <UserAvatar
                  clerkUrl={user.imageUrl}
                  name={user.name}
                  size="sm"
                  className="border border-border"
                />
                <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                  {user.name}
                </span>
              </Link>
            ) : (
              !isLoading && (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="gradient" size="sm" data-magnetic="true">
                      Get Started
                    </Button>
                  </Link>
                </>
              )
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            {isAuthenticated && user ? (
              <Link
                href="/profile"
                className="flex items-center"
                aria-label="Open profile"
                onClick={() => setMobileOpen(false)}
              >
                <UserAvatar
                  clerkUrl={user.imageUrl}
                  name={user.name}
                  size="sm"
                  className="border border-border"
                />
              </Link>
            ) : null}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="h-9 w-9 rounded-lg glass flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden overflow-hidden border-t border-border/60"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => {
                const id = link.href.slice(1);
                const isActive = activeId === id;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) =>
                      handleNavClick(e, link.href, () => setMobileOpen(false))
                    }
                    className={`block text-sm transition-colors py-2 ${
                      isActive ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
              <div className="pt-3 border-t border-border/60 flex flex-col gap-2 mt-2">
                {isAuthenticated && user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                      <Button variant="gradient" className="w-full">
                        Open Dashboard
                      </Button>
                    </Link>
                    <Link href="/profile" onClick={() => setMobileOpen(false)}>
                      <Button variant="ghost" className="w-full">
                        Profile
                      </Button>
                    </Link>
                  </>
                ) : (
                  !isLoading && (
                    <>
                      <Link href="/login" onClick={() => setMobileOpen(false)}>
                        <Button variant="ghost" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/signup" onClick={() => setMobileOpen(false)}>
                        <Button variant="gradient" className="w-full">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )
                )}
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.header>
  );
}
