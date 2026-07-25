import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useScrollSpy } from "./hooks/useScrollSpy";
import { docsConfig } from "./config";

export function TableOfContents() {
  // Flatten all the IDs from the config to observe
  const itemIds = useMemo(() => {
    const ids: string[] = [];
    docsConfig.sidebarNav.forEach((section) => {
      if (section.href.startsWith("#")) {
        ids.push(section.href.substring(1));
      }
      if (section.items) {
        section.items.forEach((item) => {
          if (item.href.startsWith("#")) {
            ids.push(item.href.substring(1));
          }
        });
      }
    });
    return ids;
  }, []);

  const activeId = useScrollSpy(itemIds, {
    rootMargin: "0px 0px -80% 0px",
  });

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        On this page
      </h4>
      <ul className="space-y-2.5 text-sm">
        {docsConfig.sidebarNav.map((section) => {
          // We can show just the current section's items, or all items.
          // Let's show all items for simplicity, or we can filter it based on active section.
          // In many docs (like shadcn), they show TOC for the *current page*.
          // Since our doc is a single long page, we'll show a simplified TOC or all sections.
          // Let's show all top level sections as TOC, and their children if active.
          
          const sectionId = section.href.substring(1);
          const isSectionActive = activeId === sectionId || section.items?.some(i => i.href.substring(1) === activeId);
          
          return (
            <li key={section.title} className="space-y-1.5">
              <a
                href={section.href}
                className={cn(
                  "block text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300",
                  activeId === sectionId && "font-medium text-primary"
                )}
              >
                {section.title}
              </a>
              
              {section.items && section.items.length > 0 && isSectionActive && (
                <ul className="ml-4 space-y-1.5 border-l border-slate-200 pl-4 dark:border-slate-800">
                  {section.items.map((item) => {
                    const itemId = item.href.substring(1);
                    return (
                      <li key={item.title}>
                        <a
                          href={item.href}
                          className={cn(
                            "block text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300",
                            activeId === itemId && "font-medium text-primary"
                          )}
                        >
                          {item.title}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
