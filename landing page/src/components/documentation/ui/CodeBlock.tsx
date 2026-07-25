import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({
  code,
  language,
  filename,
  className,
}: CodeBlockProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = React.useCallback(() => {
    navigator.clipboard.writeText(code);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  }, [code]);

  return (
    <div
      className={cn(
        "relative my-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900",
        className
      )}
    >
      {filename && (
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100/50 px-4 py-2 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
          <span>{filename}</span>
          {language && (
            <span className="text-slate-400 dark:text-slate-500 uppercase text-[10px]">
              {language}
            </span>
          )}
        </div>
      )}
      
      <div className="group relative">
        <button
          onClick={copyToClipboard}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white opacity-0 transition-opacity hover:bg-slate-50 focus:opacity-100 group-hover:opacity-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
          aria-label="Copy code"
        >
          {hasCopied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 text-slate-500" />
          )}
        </button>
        <pre className="overflow-x-auto p-4 text-sm">
          <code className="text-slate-800 dark:text-slate-200">{code}</code>
        </pre>
      </div>
    </div>
  );
}
