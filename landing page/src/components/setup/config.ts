export interface NavItem {
  title: string;
  href: string;
  items?: NavItem[];
}

export const setupConfig = {
  sidebarNav: [
    {
      title: "Setup",
      href: "#setup",
      items: [
        { title: "Overview", href: "#overview" },
        { title: "MongoDB", href: "#mongodb" },
        { title: "Sendgrid", href: "#sendgrid" },
        { title: "Cloudinary", href: "#cloudinary" },
        { title: "Environment Variables", href: "#environment-variables" },
      ],
    },
    {
      title: "Docker",
      href: "#docker",
      items: [
        { title: "Overview", href: "#docker-overview" },
        { title: "Prerequisites", href: "#docker-prerequisites" },
        { title: "Environment Variables", href: "#docker-environment-variables" },
        { title: "Build & Run", href: "#docker-build-run" },
        { title: "Accessing Services", href: "#docker-accessing-services" },
      ],
    },
    {
      title: "Deployment",
      href: "#deployment",
      items: [
        { title: "Render", href: "#render" },
        { title: "Vercel", href: "#vercel" },
        { title: "AWS", href: "#aws" },
      ],
    }
  ],
};
