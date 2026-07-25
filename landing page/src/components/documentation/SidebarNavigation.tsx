import React, { useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { docsConfig, NavItem } from "./config";
import { useScrollSpy } from "./hooks/useScrollSpy";

export function SidebarNavigation() {
  const itemIds = useMemo(() => {
    const ids: string[] = [];
    docsConfig.sidebarNav.forEach((section) => {
      if (section.href.startsWith("#")) ids.push(section.href.substring(1));
      if (section.items) {
        section.items.forEach((item) => {
          if (item.href.startsWith("#")) ids.push(item.href.substring(1));
        });
      }
    });
    return ids;
  }, []);

  const activeId = useScrollSpy(itemIds, { rootMargin: "0px 0px -80% 0px" });

  return (
    <div className="w-full">
      {docsConfig.sidebarNav.map((item, index) => (
        <SidebarGroup
          key={index}
          item={item}
          activeId={activeId}
          defaultExpanded={true}
        />
      ))}
    </div>
  );
}

interface SidebarGroupProps {
  item: NavItem;
  activeId: string;
  defaultExpanded?: boolean;
}

function SidebarGroup({ item, activeId, defaultExpanded = false }: SidebarGroupProps) {
  const isSectionActive = item.href.substring(1) === activeId || 
    item.items?.some(i => i.href.substring(1) === activeId);

  const [isExpanded, setIsExpanded] = useState(defaultExpanded || isSectionActive);

  // Auto-expand when a child becomes active
  useEffect(() => {
    if (isSectionActive) {
      setIsExpanded(true);
    }
  }, [isSectionActive]);

  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mb-4">
      <div
        className={cn(
          "group flex w-full items-center justify-between rounded-md border border-transparent px-2 py-1 hover:underline",
          isSectionActive ? "font-medium text-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-400"
        )}
      >
        <a href={item.href} className="flex-1 font-semibold">
          {item.title}
        </a>
        {item.items && (
          <button
            onClick={toggleExpand}
            className="ml-2 flex h-6 w-6 items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isExpanded ? "rotate-90" : ""
              )}
            />
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && item.items && item.items.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="ml-2 mt-1 border-l border-slate-200 pl-4 dark:border-slate-800">
              {item.items.map((subItem, index) => {
                const isSubItemActive = subItem.href.substring(1) === activeId;
                return (
                  <div key={index} className="relative mb-1">
                    {isSubItemActive && (
                      <motion.div
                        layoutId="active-indicator"
                        className="absolute -left-[17px] top-0 bottom-0 w-0.5 bg-primary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                    <a
                      href={subItem.href}
                      className={cn(
                        "block rounded-md px-2 py-1.5 text-sm transition-colors",
                        isSubItemActive
                          ? "bg-primary/10 font-bold text-primary"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-50"
                      )}
                    >
                      {subItem.title}
                    </a>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
