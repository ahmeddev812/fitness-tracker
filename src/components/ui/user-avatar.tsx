"use client";

/* eslint-disable @next/next/no-img-element */
import { User } from "lucide-react";

const SIZES = {
  xs: "h-7 w-7 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-20 w-20 text-2xl",
} as const;

interface UserAvatarProps {
  /** Custom uploaded avatar (base64) — highest priority */
  src?: string | null;
  /** Clerk image URL */
  clerkUrl?: string | null;
  name?: string;
  size?: keyof typeof SIZES;
  className?: string;
}

function initialsOf(name?: string): string {
  if (!name) return "";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function UserAvatar({
  src,
  clerkUrl,
  name,
  size = "md",
  className,
}: UserAvatarProps) {
  const image = src || clerkUrl;
  const sizeClass = SIZES[size];
  const base = `shrink-0 rounded-full object-cover ${sizeClass} ${className ?? ""}`;

  if (image) {
    return <img src={image} alt={name || "User avatar"} className={base} />;
  }

  return (
    <span
      aria-label={name || "User"}
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-accent/80 font-semibold text-white ${sizeClass} ${className ?? ""}`}
    >
      {initialsOf(name) || <User className="h-1/2 w-1/2" aria-hidden="true" />}
    </span>
  );
}
