export interface NavItem {
  title: string;
  href: string;
  items?: NavItem[];
}

export const docsConfig = {
  sidebarNav: [
    {
      title: "Introduction",
      href: "#introduction",
      items: [
        { title: "What is BeeHive?", href: "#what-is-beehive" },
        { title: "Why BeeHive?", href: "#why-beehive" },
        { title: "Features", href: "#features" },
      ],
    },
    {
      title: "Getting Started",
      href: "#getting-started",
      items: [
        { title: "Installation", href: "/setup" }
      ],
    },
    {
      title: "Architecture",
      href: "#architecture",
      items: [
        { title: "System Overview", href: "#system-overview" },
        { title: "Database", href: "#database" },
        { title: "Authentication", href: "#authentication" },
        { title: "Real-Time System", href: "#real-time-system" },
      ],
    },
    {
      title: "Admin Guide",
      href: "#admin-guide",
      items: [
        { title: "Dashboard", href: "#admin-dashboard" },
        { title: "Members", href: "#admin-members" },
        { title: "Projects", href: "#admin-projects" },
        { title: "Tasks", href: "#admin-tasks" },
        { title: "Notification", href: "#admin-notification" },
        { title: "Settings", href: "#admin-settings" },
        { title: "Community", href: "#admin-community" },
      ],
    },
    {
      title: "User Guide",
      href: "#user-guide",
      items: [
        { title: "Dashboard", href: "#user-dashboard" },
        { title: "Projects", href: "#user-projects" },
        { title: "Tasks", href: "#user-tasks" },
        { title: "Notification", href: "#user-notification" },
        { title: "Community", href: "#user-community" },
      ],
    },
    {
      title: "Developer Guide",
      href: "#developer-guide",
      items: [
        { title: "Folder Structure", href: "#folder-structure" },
        { title: "API", href: "#api" },
        { title: "Database", href: "#dev-database" },
        { title: "Environment Variables", href: "#environment-variables" },
        { title: "Contributing", href: "#contributing" },
        { title: "Deployment", href: "#deployment" },
      ],
    },
    {
      title: "Reference",
      href: "#reference",
      items: [
        { title: "FAQ", href: "#faq" },
        { title: "Troubleshooting", href: "#troubleshooting" },
        { title: "Changelog", href: "#changelog" },
        { title: "Roadmap", href: "#roadmap" },
        { title: "License", href: "#license" },
      ],
    }
  ],
};
