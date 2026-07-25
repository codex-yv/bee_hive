import { useState, useEffect, useRef } from "react";

export function useScrollSpy(
  ids: string[],
  options: IntersectionObserverInit = { rootMargin: "-100px 0px -40% 0px" }
) {
  const [activeId, setActiveId] = useState<string>("");
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver((entries) => {
      // Find all intersecting elements
      const intersectingEntries = entries.filter((entry) => entry.isIntersecting);
      
      if (intersectingEntries.length > 0) {
        // If multiple are visible, pick the one closest to the top of the viewport
        const sortedEntries = intersectingEntries.sort((a, b) => {
          return a.boundingClientRect.top - b.boundingClientRect.top;
        });
        setActiveId(sortedEntries[0].target.id);
      }
    }, options);

    elements.forEach((el) => {
      observer.current?.observe(el);
    });

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [ids, options]);

  return activeId;
}
