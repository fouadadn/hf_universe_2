// "use client";

import { useEffect, useRef, useState, useCallback } from "react";

export const useCarouselScroll = () => {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const isScrollable = el.scrollWidth > el.clientWidth;
    const isAtStart = el.scrollLeft === 0;
    // A small buffer is added to account for sub-pixel rendering issues
    const isAtEnd = Math.ceil(el.scrollLeft + el.offsetWidth) >= el.scrollWidth - 1;

    setShowLeft(isScrollable && !isAtStart);
    setShowRight(isScrollable && !isAtEnd);
  }, []);

  const scroll = useCallback((direction) => {
    const el = scrollRef.current;
    if (!el) return;

    // Scroll by the width of the container for a full-page effect
    const scrollAmount = direction === 'right' ? el.clientWidth : -el.clientWidth;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Use passive listeners for better scroll performance
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll, { passive: true });
    
    // Initial check in case content is already present
    checkScroll();

    // Use MutationObserver to re-check when carousel content changes dynamically
    const observer = new MutationObserver(checkScroll);
    observer.observe(el, { childList: true, subtree: true });

    // Cleanup function to remove listeners and observer
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
      observer.disconnect();
    };
  }, [checkScroll]);

  return { scrollRef, scroll, showLeft, showRight };
};
