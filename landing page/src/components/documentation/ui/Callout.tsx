import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

type CalloutType = "info" | "success" | "warning" | "error";

interface CalloutProps {
  title?: string;
  children: React.ReactNode;
  type?: CalloutType;
  className?: string;
}

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

export function Callout({
  title,
  children,
  type = "info",
  className,
}: CalloutProps) {
  const Icon = icons[type];

  return (
    <div
      className={cn(
        "my-6 flex items-start space-x-4 rounded-xl border p-4 text-sm shadow-sm",
        {
          "border-blue-200 bg-blue-50/50 text-blue-900 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-200":
            type === "info",
          "border-green-200 bg-green-50/50 text-green-900 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-200":
            type === "success",
          "border-amber-200 bg-amber-50/50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-200":
            type === "warning",
          "border-red-200 bg-red-50/50 text-red-900 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200":
            type === "error",
        },
        className
      )}
    >
      <Icon
        className={cn("mt-0.5 h-5 w-5 shrink-0", {
          "text-blue-600 dark:text-blue-400": type === "info",
          "text-green-600 dark:text-green-400": type === "success",
          "text-amber-600 dark:text-amber-400": type === "warning",
          "text-red-600 dark:text-red-400": type === "error",
        })}
      />
      <div className="flex-1">
        {title && <div className="mb-1 font-semibold">{title}</div>}
        <div className="leading-relaxed opacity-90">{children}</div>
      </div>
    </div>
  );
}
