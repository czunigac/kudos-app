"use client";

import { toast as sonnerToast } from "sonner";

export type ToastPayload = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

export default function useToast() {
  return {
    toast: ({ title, description, variant }: ToastPayload) => {
      if (variant === "destructive") {
        const message = [title, description].filter(Boolean).join(": ");
        sonnerToast.error(message || "Something went wrong");
        return;
      }
      if (title && description) {
        sonnerToast(title, { description });
        return;
      }
      sonnerToast(title ?? description ?? "Done");
    },
  };
}
