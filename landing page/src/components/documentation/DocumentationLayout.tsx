import React, { useState } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { SidebarNavigation } from "./SidebarNavigation";
import { TableOfContents } from "./TableOfContents";
import { DocumentationContent } from "./DocumentationContent";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

// Assuming a theme toggle function is provided by the application, 
// we will mock it here or you can integrate your own next-themes or tailwind dark mode logic.
function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
}

export function DocumentationLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="h-5 w-5" />
            </button>
            <a href="/" className="flex items-center gap-2 font-bold text-xl">
              <img src="/logo.png" alt="BeeHive" className="h-7 w-auto rounded-full" />
              <span><span className="text-black dark:text-white">Bee</span><span style={{ color: '#FFB000' }}>Hive</span></span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="container mx-auto px-4 flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)_200px] gap-6 lg:gap-10">

        {/* Left Sidebar (Desktop) */}
        <aside className="fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r border-slate-200 py-6 pr-6 dark:border-slate-800 md:sticky md:block">
          <SidebarNavigation />
        </aside>

        {/* Left Sidebar (Mobile Drawer) */}
        <AnimatePresence>
          {isMobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileOpen(false)}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm bg-white dark:bg-slate-950 p-6 shadow-xl lg:hidden overflow-y-auto border-r border-slate-200 dark:border-slate-800"
              >
                <div className="flex items-center justify-between mb-8">
                  <a href="/" className="flex items-center gap-2 font-bold text-xl">
                    <img src="/logo.png" alt="BeeHive" className="h-7 w-auto rounded-full" />
                    <span><span className="text-black dark:text-white">Bee</span><span style={{ color: '#FFB000' }}>Hive</span></span>
                  </a>
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {/* Clicking any link should close the mobile sidebar */}
                <div onClick={() => setIsMobileOpen(false)}>
                  <SidebarNavigation />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="relative py-8 lg:gap-10 xl:grid">
          <div className="mx-auto w-full min-w-0">
            {/* Prominent Logo Area */}
            <div className="flex flex-col items-center justify-center py-12 mb-12 border-b border-slate-200 dark:border-slate-800">
              <img src="/logo.png" alt="BeeHive" className="h-50 w-auto mb-4 rounded-full" />
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                <span className="text-black dark:text-white">Bee</span><span style={{ color: '#FFB000' }}>Hive</span>
              </h1>
              <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 text-center max-w-[600px]">
                Build Better Teams.
                Work Together.
                Ship Faster.
              </p>
              <div className="flex flex-wrap justify-center gap-2.5 mt-6">
                {[
                  { category: "frontend", name: "HTML5", bg: "bg-[#E34F26]", text: "text-white" },
                  { category: "styling", name: "CSS3", bg: "bg-[#1572B6]", text: "text-white" },
                  { category: "language", name: "JavaScript", bg: "bg-[#F7DF1E]", text: "text-slate-950" },
                  { category: "backend", name: "Python", bg: "bg-[#3776AB]", text: "text-white" },
                  { category: "framework", name: "FastAPI", bg: "bg-[#009688]", text: "text-white" },
                  { category: "database", name: "MongoDB", bg: "bg-[#47A248]", text: "text-white" },
                  { category: "images", name: "Cloudinary", bg: "bg-[#3448C5]", text: "text-white" },
                  { category: "email", name: "SendGrid", bg: "bg-[#1A82E2]", text: "text-white" },
                ].map((badge) => (
                  <div
                    key={badge.name}
                    className="inline-flex items-center rounded-[4px] overflow-hidden text-[11px] font-sans shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-md transition-all hover:-translate-y-0.5 cursor-default select-none border border-slate-700/10 dark:border-slate-700/40"
                  >
                    <span className="bg-[#24292e] text-[#8b949e] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider font-semibold border-r border-black/10">
                      {badge.category}
                    </span>
                    <span className={`${badge.bg} ${badge.text} px-2.5 py-1 font-bold tracking-tight`}>
                      {badge.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <DocumentationContent />
          </div>
        </main>

        {/* Right Sidebar (Table of Contents) */}
        <aside className="hidden text-sm xl:block">
          <div className="sticky top-16 -mt-10 h-[calc(100vh-4rem)] overflow-y-auto pt-16 pb-10">
            <TableOfContents />
          </div>
        </aside>
      </div>
    </div>
  );
}
