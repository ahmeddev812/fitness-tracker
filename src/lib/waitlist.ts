export interface WaitlistEntry {
  id: string;
  email: string;
  joinedAt: string;
}

const KEY = "pulse_pro_waitlist";

export function getWaitlist(): WaitlistEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is WaitlistEntry =>
        typeof e === "object" &&
        e !== null &&
        typeof (e as WaitlistEntry).email === "string",
    );
  } catch {
    return [];
  }
}

export function isOnWaitlist(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return getWaitlist().some((e) => e.email.toLowerCase() === normalized);
}

export function addToWaitlist(email: string): { ok: boolean; message: string } {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return { ok: false, message: "Enter a valid email address" };
  }
  if (isOnWaitlist(normalized)) {
    return { ok: true, message: "You're already on the waitlist!" };
  }
  const entry: WaitlistEntry = {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    email: normalized,
    joinedAt: new Date().toISOString(),
  };
  const list = getWaitlist();
  list.push(entry);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
    return { ok: true, message: "You're on the Pro waitlist!" };
  } catch {
    return { ok: false, message: "Could not save — storage unavailable" };
  }
}

export function getWaitlistCount(): number {
  return getWaitlist().length;
}
