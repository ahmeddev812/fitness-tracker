"use client";

import { useCallback, useEffect, useState } from "react";
import { addToWaitlist, isOnWaitlist, getWaitlistCount } from "@/lib/waitlist";

export function useProWaitlist() {
  const [count, setCount] = useState(0);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setCount(getWaitlistCount());
    }, 0);
    return () => window.clearTimeout(handle);
  }, []);

  const join = useCallback((email: string): { ok: boolean; message: string } => {
    const result = addToWaitlist(email);
    if (result.ok) {
      setJoined(true);
      setCount(getWaitlistCount());
    }
    return result;
  }, []);

  const check = useCallback((email: string) => {
    setJoined(isOnWaitlist(email));
  }, []);

  return { count, joined, join, check };
}
