import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
