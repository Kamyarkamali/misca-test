"use client";
import { useState, useEffect } from "react";

export function useLocalStorage(key: string, initialValue: string) {
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    return localStorage.getItem(key) || initialValue;
  });

  useEffect(() => {
    if (value === null) return;
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}
