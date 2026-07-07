import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Github,
  Sparkles,
  Users,
  Rocket,
  Code2,
  GraduationCap,
  Briefcase,
  Layers,
  MessageSquare,
  Bell,
  ShieldCheck,
  Server,
  GitBranch,
  Check,
  X,
  Menu,
  Plus,
  Minus,
  BookOpen,
  Heart,
  Settings2,
  Workflow,
  ListChecks,
  Radio,
  ChevronRight,
  Quote,
  ExternalLink,
} from "lucide-react";

/* -------------------------------------------------- */
/* Utilities                                          */
/* -------------------------------------------------- */

const easeOut = [0.22, 1, 0.36, 1] as const;

function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full hairline px-3 py-1 text-xs font-medium text-muted-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-foreground/70" />
      {children}
    </div>
  );
}

function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1180px] px-6 md:px-8 ${className}`}>{children}</div>;
}

/* -------------------------------------------------- */
/* Particle Field (CSS + subtle mouse parallax)       */
/* -------------------------------------------------- */

type P = { x: number; y: number; s: number; hue: string; d: number; delay: number };

function ParticleField() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 20, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 40, damping: 20, mass: 0.6 });

  const [particles, setParticles] = useState<P[]>([]);
  useEffect(() => {
    const colors = ["#2b7fff", "#8b5cf6", "#ef4444", "#111111"];
    const arr: P[] = [];
    for (let i = 0; i < 32; i++) {
      arr.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: 2 + Math.random() * 5,
        hue: colors[i % colors.length],
        d: 6 + Math.random() * 10,
        delay: -Math.random() * 8,
      });
    }
    setParticles(arr);
  }, []);


  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handle = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      mx.set(px * 24);
      my.set(py * 24);
    };
    window.addEventListener("pointermove", handle);
    return () => window.removeEventListener("pointermove", handle);
  }, [mx, my]);

  const tx1 = useTransform(sx, (v) => `${v}px`);
  const ty1 = useTransform(sy, (v) => `${v}px`);
  const tx2 = useTransform(sx, (v) => `${-v * 0.6}px`);
  const ty2 = useTransform(sy, (v) => `${-v * 0.6}px`);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* soft gradient blobs */}
      <motion.div
        style={{ x: tx1, y: ty1 }}
        className="absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full opacity-60 blur-3xl animate-drift"
      >
        <div className="h-full w-full rounded-full" style={{ background: "radial-gradient(closest-side, rgba(43,127,255,0.25), transparent 70%)" }} />
      </motion.div>
      <motion.div
        style={{ x: tx2, y: ty2 }}
        className="absolute top-10 -right-32 h-[560px] w-[560px] rounded-full opacity-60 blur-3xl animate-drift"
      >
        <div className="h-full w-full rounded-full" style={{ background: "radial-gradient(closest-side, rgba(139,92,246,0.22), transparent 70%)", animationDelay: "-4s" }} />
      </motion.div>
      <motion.div
        style={{ x: tx1, y: ty2 }}
        className="absolute -bottom-40 left-1/3 h-[600px] w-[600px] rounded-full opacity-50 blur-3xl animate-drift"
      >
        <div className="h-full w-full rounded-full" style={{ background: "radial-gradient(closest-side, rgba(239,68,68,0.18), transparent 70%)" }} />
      </motion.div>

      {/* particles */}
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full animate-floaty"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.s,
            height: p.s,
            background: p.hue,
            opacity: 0.35,
            animationDuration: `${p.d}s`,
            animationDelay: `${p.delay}s`,
            boxShadow: `0 0 12px ${p.hue}55`,
            willChange: "transform",
          }}
        />
      ))}

      {/* grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(17,17,17,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,17,0.045) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, black 50%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 50%, transparent 85%)",
        }}
      />
    </div>
  );
}

/* -------------------------------------------------- */
/* Nav                                                */
/* -------------------------------------------------- */

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#why", label: "Why BeeHive" },
  { href: "#how", label: "How It Works" },
  { href: "#open-source", label: "Open Source" },
  { href: "#community", label: "Community" },
  { href: "#faq", label: "FAQ" },
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: easeOut }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className={`transition-all duration-500 ${scrolled ? "py-2" : "py-4"}`}>
        <Container>
          <div
            className={`flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500 ${scrolled ? "glass shadow-[0_10px_30px_-20px_rgba(0,0,0,0.15)]" : "bg-transparent"
              }`}
          >
            <a href="#top" className="flex items-center gap-2 font-semibold tracking-tight">
              <img src="/logo.png" alt="BeeHive Logo" className="h-7 w-7 object-contain rounded-md" />
              <span>BeeHive</span>
            </a>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg"
                >
                  {l.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <a
                href="#cta"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity"
              >
                Explore Setup <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <button
                aria-label="Menu"
                onClick={() => setOpen((v) => !v)}
                className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full hairline"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Container>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden"
          >
            <Container>
              <div className="glass mt-2 rounded-2xl p-3">
                <div className="flex flex-col">
                  {NAV_LINKS.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function BeeLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`relative inline-flex h-7 w-7 items-center justify-center ${className}`}>
      <span
        className="absolute inset-0 rounded-[9px]"
        style={{ background: "conic-gradient(from 220deg, #2b7fff, #8b5cf6, #ef4444, #2b7fff)" }}
      />
      <span className="absolute inset-[2px] rounded-[7px] bg-background" />
      <span className="relative text-[13px] font-black tracking-tight">B</span>
    </span>
  );
}

/* -------------------------------------------------- */
/* Hero                                               */
/* -------------------------------------------------- */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.98]);

  return (
    <section id="top" ref={ref} className="relative isolate overflow-hidden pt-32 md:pt-40 pb-24 md:pb-32">
      <ParticleField />
      <Container>
        <motion.div style={{ y, opacity, scale }} className="relative z-10 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full hairline bg-white/70 backdrop-blur px-3 py-1 text-xs font-medium text-foreground/80">
              <Sparkles className="h-3.5 w-3.5" />
              Open Source Collaboration Platform
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-8 text-[44px] leading-[1.02] sm:text-6xl md:text-7xl lg:text-[88px] font-semibold tracking-[-0.035em]">
              Build Better Teams.
              <br />
              <span className="text-gradient">Work Together.</span>
              <br />
              Ship Faster.
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mx-auto mt-8 max-w-2xl text-base md:text-lg leading-relaxed text-muted-foreground">
              BeeHive is a self-hostable collaboration platform that brings task management,
              leadership, communication, and project execution together in one unified workspace
              for startups, hackathon teams, freelancers, and coding communities.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#cta"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-all hover:translate-y-[-1px] hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.4)]"
              >
                Explore Setup
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="https://github.com/codex-yv/bee_hive"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full hairline bg-white/70 backdrop-blur px-5 py-3 text-sm font-medium text-foreground transition-all hover:bg-white"
              >
                <Github className="h-4 w-4" />
                GitHub Repository
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.5}>
            <div className="mt-16 mx-auto max-w-4xl">
              <HeroMockup />
            </div>
          </Reveal>
        </motion.div>
      </Container>
    </section>
  );
}

function HeroMockup() {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0, rotateX: 8 }}
      whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: easeOut }}
      style={{ transformPerspective: 1200 }}
      className="relative"
    >
      <div className="absolute -inset-6 rounded-[32px] opacity-40 blur-2xl" style={{ background: "var(--grad-accent-soft)" }} />
      <div className="relative rounded-2xl hairline bg-white shadow-[0_40px_120px_-40px_rgba(17,17,17,0.25)] overflow-hidden">
        <div className="flex items-center gap-2 border-b border-hairline px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="mx-auto text-[11px] text-muted-foreground">beehive.local — Team Alpha</span>
        </div>
        <div className="grid grid-cols-12 gap-0">
          <aside className="col-span-3 border-r border-hairline p-4 text-xs">
            <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Teams</div>
            {["Product", "Engineering", "Design", "Growth"].map((t, i) => (
              <div key={t} className={`mb-1 flex items-center gap-2 rounded-md px-2 py-1.5 ${i === 1 ? "bg-accent text-foreground" : "text-muted-foreground"}`}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: ["#2b7fff", "#8b5cf6", "#ef4444", "#111"][i] }} />
                {t}
              </div>
            ))}
          </aside>
          <main className="col-span-9 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Sprint 12</div>
                <div className="text-sm font-semibold">Ship v0.4 · Realtime updates</div>
              </div>
              <div className="flex -space-x-2">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="h-6 w-6 rounded-full border-2 border-white" style={{ background: ["#2b7fff", "#8b5cf6", "#ef4444", "#111"][i] }} />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {["Todo", "In Progress", "Done"].map((col, ci) => (
                <div key={col} className="rounded-lg hairline bg-secondary/40 p-2">
                  <div className="mb-2 flex items-center justify-between px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {col} <span>{[4, 3, 5][ci]}</span>
                  </div>
                  {[0, 1, 2].map((k) => (
                    <motion.div
                      key={k}
                      initial={{ opacity: 0, y: 6 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + (ci * 3 + k) * 0.05, duration: 0.5, ease: easeOut }}
                      className="mb-2 rounded-md bg-white hairline p-2.5 text-[11px] shadow-sm"
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="rounded px-1.5 py-0.5 text-[9px] font-medium" style={{ background: "var(--grad-accent-soft)" }}>
                          BH-{100 + ci * 3 + k}
                        </span>
                        <span className="h-4 w-4 rounded-full" style={{ background: ["#2b7fff", "#8b5cf6", "#ef4444"][k % 3] }} />
                      </div>
                      <div className="font-medium leading-tight">{["Wire realtime channel", "Role RBAC review", "Redesign nav", "Realtime presence", "Refactor auth", "Hive theming", "Task filters", "SSE fallback", "Docs pass"][ci * 3 + k]}</div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------- */
/* Perfect For                                        */
/* -------------------------------------------------- */

const AUDIENCES = [
  { icon: Rocket, label: "Startups" },
  { icon: Code2, label: "Hackathon Teams" },
  { icon: Briefcase, label: "Freelancers" },
  { icon: Users, label: "Coding Communities" },
  { icon: GraduationCap, label: "Educational Teams" },
];

function PerfectFor() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <Reveal className="mb-14 flex flex-col items-center text-center">
          <SectionLabel>Perfect For</SectionLabel>
          <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-[-0.02em]">
            Made for teams that build.
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {AUDIENCES.map(({ icon: Icon, label }, i) => (
            <Reveal key={label} delay={i * 0.06}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4, ease: easeOut }}
                className="group relative rounded-2xl hairline bg-white p-6 text-center overflow-hidden"
              >
                <div className="absolute inset-x-0 -top-16 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" style={{ background: "var(--grad-accent-soft)" }} />
                <div className="relative">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl hairline bg-secondary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-medium">{label}</div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------- */
/* Problem                                            */
/* -------------------------------------------------- */

const PROBLEMS = [
  { icon: Layers, title: "Scattered task tracking", body: "Sticky notes, spreadsheets, and DMs — nothing lives in one place." },
  { icon: MessageSquare, title: "Disconnected communication", body: "Conversations trapped in tools that don't talk to your work." },
  { icon: ShieldCheck, title: "No leadership visibility", body: "Leads can't see what's blocked, what's shipping, or who's stuck." },
  { icon: Radio, title: "Poor remote collaboration", body: "Timezones and tools drift teams apart when they should sync." },
  { icon: Settings2, title: "Too many disconnected tools", body: "Every subscription adds friction, cost, and context switching." },
];

function Problem() {
  return (
    <section id="why" className="py-24 md:py-32 bg-secondary/40">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionLabel>The Problem</SectionLabel>
              <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-[-0.02em] leading-[1.05]">
                Managing teams shouldn't feel chaotic.
              </h2>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                Modern teams juggle a dozen tools to do one job. BeeHive replaces the sprawl with a
                single, focused workspace.
              </p>
            </Reveal>
            {/* <Reveal delay={0.1}>
              <ProblemIllustration />
            </Reveal> */}
          </div>
          <div className="lg:col-span-7 space-y-3">
            {PROBLEMS.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 0.06}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="group flex gap-4 rounded-2xl hairline bg-white p-5"
                >
                  <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary hairline">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{title}</div>
                    <div className="mt-1 text-sm text-muted-foreground leading-relaxed">{body}</div>
                  </div>
                  <ChevronRight className="ml-auto h-5 w-5 self-center text-muted-foreground/40 transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

// function ProblemIllustration() {
//   return (
//     <div className="relative mt-10 aspect-[4/3] rounded-2xl hairline bg-white overflow-hidden">
//       <div className="absolute inset-0" style={{ background: "var(--grad-accent-soft)", opacity: 0.5 }} />
//       {["Slack", "Notion", "Jira", "Docs", "Trello", "Email", "Sheets", "Zoom"].map((t, i) => {
//         const angle = (i / 8) * Math.PI * 2;
//         const r = 32;
//         const x = 50 + Math.cos(angle) * r;
//         const y = 50 + Math.sin(angle) * r;
//         return (
//           <motion.div
//             key={t}
//             initial={{ opacity: 0, scale: 0.6 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: easeOut }}
//             className="absolute -translate-x-1/2 -translate-y-1/2 rounded-lg hairline bg-white px-2.5 py-1 text-[11px] shadow-sm animate-floaty"
//             style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${-i}s` }}
//           >
//             {t}
//           </motion.div>
//         );
//       })}
//       <div className="absolute inset-0 flex items-center justify-center">
//         <div className="rounded-2xl hairline bg-white px-4 py-3 shadow-lg flex items-center gap-2">
//           <img src="/logo.png" alt="BeeHive Logo" className="h-6 w-6 object-contain rounded-md" />
//           <span className="text-sm font-semibold">BeeHive</span>
//         </div>
//       </div>
//     </div>
//   );
// }

/* -------------------------------------------------- */
/* Solution                                           */
/* -------------------------------------------------- */

const SOLUTIONS = [
  { icon: Users, title: "Team & Leadership Management", body: "Structure your org, assign leads, and give every team clear ownership." },
  { icon: ListChecks, title: "Task & Project Assignment", body: "Break down projects into tasks and route them to the right people fast." },
  { icon: MessageSquare, title: "Community Chat", body: "Threaded conversations tied directly to the work they belong to." },
  { icon: ShieldCheck, title: "Role Management", body: "Granular roles and permissions that scale from 3 to 300 members." },
  { icon: Bell, title: "Real-Time Notifications", body: "Instant updates on progress, mentions, and status changes — no polling." },
  { icon: Server, title: "Self-Hostable Architecture", body: "Run it on your own infrastructure. Your data, your servers, your rules." },
  { icon: GitBranch, title: "Open Source", body: "Auditable, extensible, and free forever. Fork it, ship it, own it." },
];

function Solution() {
  return (
    <section id="features" className="py-24 md:py-32">
      <Container>
        <Reveal className="mb-14 max-w-2xl">
          <SectionLabel>The Solution</SectionLabel>
          <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-[-0.02em] leading-[1.05]">
            Everything your team needs.
            <br />
            <span className="text-muted-foreground">In one place.</span>
          </h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SOLUTIONS.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 0.05}>
              <motion.div
                whileHover={{ y: -4 }}
                className="group relative h-full rounded-2xl hairline bg-white p-6 overflow-hidden transition-shadow duration-500 hover:shadow-[var(--shadow-glow)]"
              >
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl" style={{ background: "var(--grad-accent-soft)" }} />
                <div className="relative">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl hairline bg-secondary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="font-semibold tracking-tight">{title}</div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------- */
/* Feature Showcase (alternating)                     */
/* -------------------------------------------------- */

const SHOWCASE = [
  {
    tag: "Leadership",
    title: "Leadership Management",
    body: "Give team leads a bird's-eye view of ownership, blockers, and momentum — without micromanaging.",
    Visual: LeadershipVisual,
  },
  {
    tag: "Tasks",
    title: "Task Tracking",
    body: "Assign the task to team members and track the current status of the assigned tasks. Members will automatically be notified via email.",
    Visual: TaskVisual,
  },
  {
    tag: "Projects",
    title: "Project Assignment",
    body: "Break down big ideas into actionable projects. Assign owners, set deadlines, and watch progress. Team members will be notified through email.",
    Visual: ProjectVisual,
  },
  {
    tag: "Chat",
    title: "Community Chat",
    body: "Discuss the work where the work lives. Threads stay attached to tasks and projects.",
    Visual: ChatVisual,
  },
  {
    tag: "Realtime",
    title: "Real-Time Progress",
    body: "Get the visual updates of the on going taks and projects on the dashboard. Get real-time notification for every update.",
    Visual: RealtimeVisual,
  },
  {
    tag: "Deploy",
    title: "Self Hostable & Open Source",
    body: "Deploy this SaaS for your own company/org/team with few easy steps.",
    Visual: DeployVisual,
  },
];

function FeatureShowcase() {
  return (
    <section className="py-24 md:py-32 bg-secondary/40">
      <Container>
        <Reveal className="mb-16 max-w-2xl">
          <SectionLabel>Feature Showcase</SectionLabel>
          <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-[-0.02em] leading-[1.05]">
            Designed for the way modern teams work.
          </h2>
        </Reveal>
        <div className="space-y-20 md:space-y-28">
          {SHOWCASE.map(({ tag, title, body, Visual }, i) => {
            const flip = i % 2 === 1;
            return (
              <div key={title} className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                <div className={`lg:col-span-5 ${flip ? "lg:order-2" : ""}`}>
                  <Reveal>
                    <SectionLabel>{tag}</SectionLabel>
                    <h3 className="mt-4 text-2xl md:text-4xl font-semibold tracking-[-0.02em]">{title}</h3>
                    <p className="mt-4 text-muted-foreground leading-relaxed max-w-md">{body}</p>
                    <a href="#cta" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium">
                      Learn more <ArrowRight className="h-4 w-4" />
                    </a>
                  </Reveal>
                </div>
                <div className={`lg:col-span-7 ${flip ? "lg:order-1" : ""}`}>
                  <Reveal delay={0.1}>
                    <ShowcaseFrame>
                      <Visual />
                    </ShowcaseFrame>
                  </Reveal>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function ShowcaseFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-[28px] opacity-40 blur-2xl" style={{ background: "var(--grad-accent-soft)" }} />
      <div className="relative rounded-2xl hairline bg-white p-5 md:p-6 shadow-[0_40px_100px_-40px_rgba(17,17,17,0.18)]">
        {children}
      </div>
    </div>
  );
}

function LeadershipVisual() {
  const rows = [
    { name: "Ava Chen", role: "Product Lead", load: 78, color: "#2b7fff" },
    { name: "Noah Park", role: "Eng Lead", load: 62, color: "#8b5cf6" },
    { name: "Mia Rossi", role: "Design Lead", load: 44, color: "#ef4444" },
    { name: "Kai Tanaka", role: "Growth Lead", load: 91, color: "#111" },
  ];
  return (
    <div className="space-y-3">
      {rows.map((r, i) => (
        <motion.div
          key={r.name}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.6, ease: easeOut }}
          className="flex items-center gap-4 rounded-xl hairline p-3"
        >
          <div className="h-9 w-9 rounded-full" style={{ background: r.color }} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{r.name}</span>
              <span className="text-muted-foreground">{r.load}%</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${r.load}%` }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.9, ease: easeOut }}
                className="h-full"
                style={{ background: r.color }}
              />
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">{r.role}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function TaskVisual() {
  const tasks = [
    { t: "Implement realtime presence", s: "In Progress", c: "#2b7fff" },
    { t: "Redesign onboarding flow", s: "Review", c: "#8b5cf6" },
    { t: "RBAC edge cases", s: "Todo", c: "#111" },
    { t: "Docs: self-hosting on VPS", s: "Done", c: "#22c55e" },
    { t: "Notification batching", s: "In Progress", c: "#2b7fff" },
  ];
  return (
    <div className="space-y-2">
      {tasks.map((t, i) => (
        <motion.div
          key={t.t}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06, duration: 0.5, ease: easeOut }}
          className="flex items-center justify-between rounded-lg hairline px-3 py-2.5"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="h-2 w-2 rounded-full" style={{ background: t.c }} />
            <span className="text-sm truncate">{t.t}</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full hairline text-muted-foreground">{t.s}</span>
        </motion.div>
      ))}
    </div>
  );
}

function ProjectVisual() {
  const projects = [
    { name: "Realtime v0.4", pct: 72, color: "#2b7fff" },
    { name: "Design System", pct: 45, color: "#8b5cf6" },
    { name: "Docs Rewrite", pct: 88, color: "#ef4444" },
  ];
  return (
    <div className="grid sm:grid-cols-3 gap-3">
      {projects.map((p, i) => (
        <motion.div
          key={p.name}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.6, ease: easeOut }}
          className="rounded-xl hairline p-4"
        >
          <div className="text-xs text-muted-foreground">Project</div>
          <div className="font-medium mt-0.5">{p.name}</div>
          <div className="mt-4 relative h-16 w-16">
            <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="var(--border)" strokeWidth="3" />
              <motion.circle
                cx="18" cy="18" r="15" fill="none" stroke={p.color} strokeWidth="3" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 15}
                initial={{ strokeDashoffset: 2 * Math.PI * 15 }}
                whileInView={{ strokeDashoffset: 2 * Math.PI * 15 * (1 - p.pct / 100) }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: easeOut, delay: 0.2 + i * 0.08 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold">{p.pct}%</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function ChatVisual() {
  const msgs = [
    { who: "Ava", txt: "Merging the realtime PR — nice work everyone.", c: "#2b7fff", me: false },
    { who: "You", txt: "Deploying to staging now.", c: "#111", me: true },
    { who: "Noah", txt: "Presence indicators look great in prod.", c: "#8b5cf6", me: false },
  ];
  return (
    <div className="space-y-3">
      {msgs.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.12, duration: 0.5, ease: easeOut }}
          className={`flex gap-3 ${m.me ? "flex-row-reverse" : ""}`}
        >
          <div className="h-8 w-8 shrink-0 rounded-full" style={{ background: m.c }} />
          <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${m.me ? "bg-foreground text-background" : "hairline bg-white"}`}>
            <div className="mb-0.5 text-[10px] opacity-70">{m.who}</div>
            {m.txt}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function RealtimeVisual() {
  return (
    <div className="relative h-48 overflow-hidden rounded-xl hairline">
      <div className="absolute inset-0" style={{ background: "var(--grad-accent-soft)" }} />
      <svg viewBox="0 0 400 160" className="absolute inset-0 h-full w-full">
        <motion.path
          d="M0,120 C60,80 100,140 160,90 C220,40 260,120 320,70 C360,40 380,80 400,60"
          fill="none"
          stroke="url(#g1)"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: easeOut }}
        />
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="#2b7fff" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute bottom-3 left-3 rounded-full glass px-3 py-1 text-[11px]">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
        Live · 12 members online
      </div>
    </div>
  );
}

function DeployVisual() {
  return (
    <div className="rounded-xl bg-[#0b0b0f] p-5 font-mono text-[12px] leading-relaxed text-white/90">
      <div className="mb-2 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="ml-2 text-white/40">~/beehive</span>
      </div>
      {[
        "$ git clone github.com/beehive/beehive",
        "$ docker compose up -d",
        "→ postgres  ready in 1.2s",
        "→ realtime  ready in 0.8s",
        "→ web       ready on :3000",
        "✓ BeeHive is live at http://localhost:3000",
      ].map((l, i) => (
        <motion.div
          key={l}
          initial={{ opacity: 0, x: -6 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.12, duration: 0.4 }}
          className={l.startsWith("→") ? "text-white/60" : l.startsWith("✓") ? "text-emerald-400" : ""}
        >
          {l}
        </motion.div>
      ))}
    </div>
  );
}

/* -------------------------------------------------- */
/* How It Works                                       */
/* -------------------------------------------------- */

const STEPS = [
  { n: "01", t: "Setup BeeHive", d: "One command to deploy on your infrastructure." },
  { n: "02", t: "Create Teams", d: "Organize members into focused, purposeful groups." },
  { n: "03", t: "Assign Roles", d: "Grant permissions with fine-grained access control." },
  { n: "04", t: "Create Tasks", d: "Break projects into clear, ownable work items." },
  { n: "05", t: "Collaborate", d: "Chat, comment, and iterate in real time." },
  { n: "06", t: "Ship Faster", d: "Deliver work with clarity and momentum." },
];

function HowItWorks() {
  return (
    <section id="how" className="py-24 md:py-32">
      <Container>
        <Reveal className="mb-16 max-w-2xl">
          <SectionLabel>How It Works</SectionLabel>
          <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-[-0.02em]">From zero to shipping in minutes.</h2>
        </Reveal>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent lg:left-1/2" />
          <div className="space-y-8 md:space-y-10">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.05}>
                <div className={`relative flex gap-6 lg:grid lg:grid-cols-2 lg:gap-16 ${i % 2 === 0 ? "" : "lg:[&>*:first-child]:col-start-2"}`}>
                  <div className={`flex items-start gap-4 ${i % 2 === 0 ? "" : "lg:justify-end lg:text-right"}`}>
                    <div className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full hairline bg-white font-mono text-sm font-semibold ${i % 2 === 0 ? "" : "lg:order-2"}`}>
                      {s.n}
                    </div>
                    <div>
                      <div className="text-xl md:text-2xl font-semibold tracking-tight">{s.t}</div>
                      <div className="mt-1 text-muted-foreground max-w-sm">{s.d}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------- */
/* Open Source                                        */
/* -------------------------------------------------- */

const OS_CARDS = [
  { icon: GitBranch, t: "100% Open Source", d: "MIT licensed. Read, fork, and modify freely." },
  { icon: Server, t: "Self Host Anywhere", d: "Docker, Kubernetes, or bare metal — you choose." },
  { icon: Settings2, t: "Customize Freely", d: "Every module is composable and replaceable." },
  { icon: Heart, t: "Community Driven", d: "Roadmap shaped by contributors, not committees." },
  { icon: ShieldCheck, t: "No Vendor Lock-In", d: "Your data, your servers, your rules — always." },
];

function OpenSource() {
  return (
    <section id="open-source" className="py-24 md:py-32 bg-secondary/40">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-end">
          <Reveal>
            <SectionLabel>Open Source</SectionLabel>
            <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-[-0.02em] leading-[1.05]">
              Built for developers.
              <br />
              <span className="text-gradient">Owned by you.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              No hidden telemetry. No paywalled features. No servers you don't control. BeeHive is
              yours to run, extend, and improve — forever.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {OS_CARDS.map(({ icon: Icon, t, d }, i) => (
            <Reveal key={t} delay={i * 0.05}>
              <motion.div whileHover={{ y: -4 }} className="h-full rounded-2xl hairline bg-white p-5">
                <Icon className="h-5 w-5" />
                <div className="mt-4 font-medium">{t}</div>
                <div className="mt-1 text-sm text-muted-foreground leading-relaxed">{d}</div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-14">
          <div className="rounded-2xl hairline bg-white p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background">
                <Github className="h-5 w-5" />
              </div>
              <div>
                <div className="font-mono text-sm">github.com/codex-yv/bee_hive</div>
                <div className="text-xs text-muted-foreground mt-0.5">Star, fork, and contribute on GitHub</div>
              </div>
            </div>
            <a
              href="https://github.com/codex-yv/bee_hive"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity"
            >
              Visit Now <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="font-semibold text-lg tracking-tight">{n}</div>
      <div className="text-xs text-muted-foreground">{l}</div>
    </div>
  );
}

/* -------------------------------------------------- */
/* Target Users grid                                  */
/* -------------------------------------------------- */

const TARGETS = [
  { t: "Startups", d: "Move fast without losing structure.", grad: "linear-gradient(135deg,#2b7fff,#8b5cf6)" },
  { t: "Freelancers", d: "Manage clients and deliverables in one place.", grad: "linear-gradient(135deg,#8b5cf6,#ef4444)" },
  { t: "Hackathon Teams", d: "Ship in 48 hours without dropping the ball.", grad: "linear-gradient(135deg,#ef4444,#f59e0b)" },
  { t: "Coding Communities", d: "Coordinate contributors across timezones.", grad: "linear-gradient(135deg,#111,#2b7fff)" },
  { t: "Student Groups", d: "Learn to collaborate the way real teams do.", grad: "linear-gradient(135deg,#22c55e,#2b7fff)" },
];

function TargetUsers() {
  return (
    <section id="community" className="py-24 md:py-32">
      <Container>
        <Reveal className="mb-14 max-w-2xl">
          <SectionLabel>Who It's For</SectionLabel>
          <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-[-0.02em]">Teams of every shape.</h2>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TARGETS.map((t, i) => (
            <Reveal key={t.t} delay={i * 0.05}>
              <motion.div whileHover={{ y: -4 }} className="group relative aspect-[4/3] rounded-2xl hairline bg-white overflow-hidden">
                <div className="absolute inset-0 opacity-90 transition-transform duration-700 group-hover:scale-110" style={{ background: t.grad }} />
                <div className="absolute inset-0" style={{ background: "radial-gradient(120% 80% at 50% 100%, rgba(255,255,255,0.85), transparent 60%)" }} />
                {/* abstract shapes */}
                <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/30 blur-2xl animate-floaty" />
                <div className="absolute top-1/2 left-6 h-16 w-16 rounded-2xl bg-white/40 animate-floaty" style={{ animationDelay: "-3s" }} />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="text-xl font-semibold tracking-tight text-foreground">{t.t}</div>
                  <div className="mt-1 text-sm text-foreground/70">{t.d}</div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------- */
/* Comparison                                         */
/* -------------------------------------------------- */

const COMPARISON = [
  { row: "Task Management", trad: "Spread across 3 tools", bee: true },
  { row: "Communication", trad: "In a separate chat app", bee: true },
  { row: "Leadership Visibility", trad: "Manual status updates", bee: true },
  { row: "Project Tracking", trad: "Spreadsheets & PDFs", bee: true },
  { row: "Open Source", trad: "Closed & proprietary", bee: true },
  { row: "Self Hosting", trad: "Vendor-controlled cloud", bee: true },
  { row: "Unified Platform", trad: "Fragmented experience", bee: true },
];

function Comparison() {
  return (
    <section className="py-24 md:py-32 bg-secondary/40">
      <Container>
        <Reveal className="mb-14 text-center">
          <SectionLabel>Comparison</SectionLabel>
          <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-[-0.02em]">
            BeeHive vs traditional workflow.
          </h2>
        </Reveal>
        <Reveal>
          <div className="overflow-hidden rounded-2xl hairline bg-white">
            <div className="grid grid-cols-3 border-b border-hairline text-sm">
              <div className="p-4 md:p-5 text-muted-foreground">Capability</div>
              <div className="p-4 md:p-5 text-muted-foreground">Traditional Workflow</div>
              <div className="p-4 md:p-5 font-semibold flex items-center gap-2">
                <img src="/logo.png" alt="BeeHive Logo" className="h-7 w-7 object-contain rounded-md" /> BeeHive
              </div>
            </div>
            {COMPARISON.map((r, i) => (
              <div key={r.row} className={`grid grid-cols-3 text-sm ${i !== COMPARISON.length - 1 ? "border-b border-hairline" : ""}`}>
                <div className="p-4 md:p-5 font-medium">{r.row}</div>
                <div className="p-4 md:p-5 text-muted-foreground flex items-center gap-2">
                  <X className="h-4 w-4 text-muted-foreground/60" />
                  {r.trad}
                </div>
                <div className="p-4 md:p-5 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: "var(--grad-accent)" }}>
                    <Check className="h-3 w-3 text-white" />
                  </span>
                  Built in
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* -------------------------------------------------- */
/* Testimonials                                       */
/* -------------------------------------------------- */

// const TESTIMONIALS = [
//   { q: "BeeHive replaced four tools for our team in a weekend.", n: "Ava Chen", r: "Founder, Lattice Labs" },
//   { q: "The self-hosted setup was genuinely one command. Wild.", n: "Noah Park", r: "Engineering Lead, Northwind" },
//   { q: "Finally a collaboration tool that respects developers.", n: "Mia Rossi", r: "Maintainer, OpenGrid" },
//   { q: "We ran our whole hackathon on it. Zero friction.", n: "Kai Tanaka", r: "Hackathon Organizer" },
//   { q: "The role system is a masterclass in simplicity.", n: "Elena Sokolova", r: "CTO, Kepler Systems" },
//   { q: "Owning our data changed how our community operates.", n: "Sam Idris", r: "Community Lead, DevForge" },
// ];

// function Testimonials() {
//   const list = [...TESTIMONIALS, ...TESTIMONIALS];
//   return (
//     <section className="py-24 md:py-32 overflow-hidden">
//       <Container>
//         <Reveal className="mb-14 max-w-2xl">
//           <SectionLabel>Loved by Teams</SectionLabel>
//           <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-[-0.02em]">
//             Trusted by builders everywhere.
//           </h2>
//         </Reveal>
//       </Container>
//       <div className="relative">
//         <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-background to-transparent" />
//         <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-background to-transparent" />
//         <div className="flex gap-4 animate-marquee will-change-transform" style={{ width: "max-content" }}>
//           {list.map((t, i) => (
//             <div key={i} className="w-[340px] shrink-0 rounded-2xl hairline bg-white p-6 shadow-[0_20px_50px_-30px_rgba(17,17,17,0.15)]">
//               <Quote className="h-6 w-6 text-foreground/20" />
//               <p className="mt-3 text-[15px] leading-relaxed">{t.q}</p>
//               <div className="mt-5 flex items-center gap-3">
//                 <div className="h-9 w-9 rounded-full" style={{ background: `hsl(${(i * 47) % 360} 60% 60%)` }} />
//                 <div>
//                   <div className="text-sm font-medium">{t.n}</div>
//                   <div className="text-xs text-muted-foreground">{t.r}</div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

/* -------------------------------------------------- */
/* FAQ                                                */
/* -------------------------------------------------- */

const FAQS = [
  { q: "Is BeeHive really free and open source?", a: "Yes. BeeHive is MIT licensed. You can read, fork, modify, and self-host it forever, at no cost." },
  { q: "Where does my data live?", a: "Wherever you deploy it. BeeHive runs on your own infrastructure — VPS, Kubernetes, or your laptop." },
  { q: "Do I need to be a developer to run it?", a: "One-command Docker Compose gets you started. Basic terminal familiarity is enough." },
  { q: "Does BeeHive support real-time updates?", a: "Yes. Presence, task updates, and chat are all real-time out of the box." },
  { q: "Can I customize or extend BeeHive?", a: "Absolutely. The codebase is modular. Replace, extend, or theme any part of it." },
  { q: "How does it compare to hosted tools?", a: "You get similar functionality without vendor lock-in, subscription fees, or data risk." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-24 md:py-32">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <Reveal>
              <SectionLabel>FAQ</SectionLabel>
              <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-[-0.02em] leading-[1.05]">
                Questions, answered.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Everything you need to know before deploying BeeHive for your team.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <div className="divide-y divide-hairline rounded-2xl hairline bg-white">
              {FAQS.map((f, i) => {
                const isOpen = open === i;
                return (
                  <div key={f.q}>
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-5 md:px-6 py-5 text-left"
                    >
                      <span className="font-medium">{f.q}</span>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full hairline">
                        {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: easeOut }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 md:px-6 pb-5 text-muted-foreground leading-relaxed">{f.a}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------- */
/* CTA                                                */
/* -------------------------------------------------- */

function CTA() {
  return (
    <section id="cta" className="py-24 md:py-32">
      <Container>
        <div className="relative overflow-hidden rounded-3xl hairline bg-white p-10 md:p-16 text-center">
          <div className="absolute inset-0 opacity-70" style={{ background: "var(--grad-accent-soft)" }} />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-64 w-[80%] rounded-full blur-3xl opacity-60" style={{ background: "var(--grad-accent-soft)" }} />
          <div className="relative">
            <Reveal>
              <SectionLabel>Get Started</SectionLabel>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 text-4xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.02]">
                Ready to build <span className="text-gradient">better teams?</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-6 max-w-xl text-muted-foreground leading-relaxed">
                Deploy BeeHive for your own team and experience organized collaboration without
                vendor lock-in.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="#"
                  className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-all hover:translate-y-[-1px] hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.4)]"
                >
                  Explore Setup
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <a
                  href="https://github.com/codex-yv/bee_hive"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full hairline bg-white px-5 py-3 text-sm font-medium"
                >
                  <Github className="h-4 w-4" />
                  GitHub Repository
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------- */
/* Footer                                             */
/* -------------------------------------------------- */

const FOOTER_COLS = [
  { h: "Product", links: ["Features", "How It Works", "Comparison", "FAQ"] },
  { h: "Open Source", links: ["GitHub", "License", "Contributing", "Roadmap"] },
  { h: "Community", links: ["Discussions", "Discord", "Twitter", "Blog"] },
  { h: "Resources", links: ["Documentation", "Self-Hosting Guide", "Changelog", "Support"] },
];

function Footer() {
  return (
    <footer className="border-t border-hairline">
      <Container className="py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 font-semibold">
              <BeeLogo />
              BeeHive
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
              The open-source collaboration platform built for modern teams.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a href="#" aria-label="GitHub" className="flex h-9 w-9 items-center justify-center rounded-full hairline hover:bg-accent">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Workflow" className="flex h-9 w-9 items-center justify-center rounded-full hairline hover:bg-accent">
                <Workflow className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Community" className="flex h-9 w-9 items-center justify-center rounded-full hairline hover:bg-accent">
                <MessageSquare className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:col-span-8">
            {FOOTER_COLS.map((c) => (
              <div key={c.h}>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.h}</div>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-t border-hairline pt-6 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} BeeHive. MIT Licensed.</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Security</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

/* -------------------------------------------------- */
/* Page                                               */
/* -------------------------------------------------- */

export function Landing() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <PerfectFor />
        <Problem />
        <Solution />
        <FeatureShowcase />
        <HowItWorks />
        <OpenSource />
        <TargetUsers />
        <Comparison />
        {/* <Testimonials /> */}
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
