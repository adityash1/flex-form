import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function CompletePayment(): Promise<{ success: boolean }> {
  // we'll implement payment logic here.
  // For now, we'll just return a success status.

  return { success: true };
}

export function isCurrentMonth(month: string) {
  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  return month === currentMonth;
}
