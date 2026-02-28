"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { FaviconManager } from "@/components/FaviconManager";
import { CursorTrail } from "@/components/CursorTrail";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";

export function Providers({ children }) {
  return (
    <SmoothScrollProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <FaviconManager />
          <CursorTrail />
          <Toaster />
          {children}
        </TooltipProvider>
      </QueryClientProvider>
    </SmoothScrollProvider>
  );
}
