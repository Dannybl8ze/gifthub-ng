import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** shadcn-style class merger: combines clsx + tailwind-merge for conflict-aware className composition. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
