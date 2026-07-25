import React, { JSX } from "react";
import { cn } from "@/lib/utils";
import { Hash } from "lucide-react";

interface SectionHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  id: string;
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  icon?: React.ReactNode;
}

export function SectionHeading({
  id,
  children,
  level = 2,
  className,
  icon,
  ...props
}: SectionHeadingProps) {
  const Component = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  return (
    <Component
      id={id}
      className={cn(
        "group relative flex items-center font-bold tracking-tight text-slate-900 dark:text-slate-100 scroll-m-24",
        {
          "text-4xl mb-8 pb-4 border-b border-slate-200 dark:border-slate-800": level === 1,
          "text-3xl mt-12 mb-6": level === 2,
          "text-2xl mt-8 mb-4": level === 3,
          "text-xl mt-6 mb-4": level === 4,
        },
        className
      )}
      {...props}
    >
      <a
        href={`#${id}`}
        className="absolute -left-8 flex h-full items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 hidden md:flex"
        aria-label="Link to section"
      >
        <Hash className="h-5 w-5 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100" />
      </a>
      {icon && <span className="mr-3 text-slate-600 dark:text-white">{icon}</span>}
      {children}
    </Component>
  );
}
