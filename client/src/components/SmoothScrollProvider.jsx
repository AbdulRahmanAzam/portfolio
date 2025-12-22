import { useEffect, useState, useCallback } from "react";
import { ReactLenis, useLenis } from "lenis/react";

// ============================================================================
// SMOOTH SCROLL CONFIGURATION
// Optimized for 60fps, no lag, calm & intentional feel
// ============================================================================
const SCROLL_CONFIG = {
  // Core smoothness settings
  duration: 1.0,              // Total scroll animation duration (lower = snappier)
  lerp: 0.08,                 // Linear interpolation (lower = smoother, higher = more responsive)
  
  // Wheel behavior
  smoothWheel: true,
  wheelMultiplier: 0.7,       // Scroll speed multiplier (lower = calmer scrolling)
  
  // Touch behavior (disabled for better mobile performance)
  smoothTouch: false,
  touchMultiplier: 1.5,
  
  // Orientation
  orientation: "vertical",
  gestureOrientation: "vertical",
  
  // Easing function - custom ease-out for calm, intentional feel
  easing: (t) => {
    // Custom ease-out-expo - starts fast, ends smoothly
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  },
  
  // Prevents infinite scrolling
  infinite: false,
  
  // Auto RAF for better performance
  autoRaf: true,
};

// Performance optimization: Passive event listeners
const PASSIVE_OPTIONS = { passive: true };

export function SmoothScrollProvider({ children }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference, PASSIVE_OPTIONS);

    // Mark as ready after initial check
    setIsReady(true);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  // Disable native smooth scroll to prevent conflicts
  useEffect(() => {
    if (reducedMotion) return;
    
    const previous = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    
    // Optimize for 60fps - hint to browser for GPU acceleration
    document.body.style.willChange = "scroll-position";
    
    return () => {
      document.documentElement.style.scrollBehavior = previous;
      document.body.style.willChange = "auto";
    };
  }, [reducedMotion]);

  // Prevent layout shift by waiting for ready state
  if (!isReady) {
    return <>{children}</>;
  }

  // Respect reduced motion preference
  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={SCROLL_CONFIG}>
      {children}
    </ReactLenis>
  );
}

// Custom hook to access Lenis instance
export function useSmoothScrollInstance() {
  return useLenis();
}
