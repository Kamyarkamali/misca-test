"use client";
import { useState, useEffect } from "react";

export function useLocalStorage(key: string, initialValue: string) {
  const [value, setValue] = useState<string>(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? stored : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, value);
    } catch {}
  }, [key, value]);

  return [value, setValue] as const;
}
