// Tremor Toaster [v0.0.0]

"use client"

import { useToast } from "@/lib/useToast"

import { Toast, ToastProvider, ToastViewport } from "./Toast"

const Toaster = () => {
  const { toasts } = useToast();
  const latestToast = toasts[0];

  return (
    <ToastProvider swipeDirection="right">
      {latestToast && (
        <Toast key={latestToast.id} {...latestToast} />
      )}
      <ToastViewport />
    </ToastProvider>
  );
};

export { Toaster }