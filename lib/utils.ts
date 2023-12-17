import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function CompletePayment(
  user: any
): Promise<{ success: boolean }> {
  // wel'll payment logic here.
  // For now, we'll just return a success status.

  return { success: true };
}
