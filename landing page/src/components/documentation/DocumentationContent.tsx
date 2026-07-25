import React from "react";
import { SectionHeading } from "./ui/SectionHeading";
import { Callout } from "./ui/Callout";
import { CodeBlock } from "./ui/CodeBlock";
import {
  ArrowRight,
  Box,
  Shield,
  Zap,
  Database,
  Sparkles,
  Download,
  Cpu,
  Radio,
  FolderTree,
  Code2,
  KeyRound,
  HelpCircle,
  LifeBuoy,
  History,
  Milestone,
  Scale
} from "lucide-react";

export function DocumentationContent() {
  return (
    <div className="w-full max-w-4xl mx-auto pb-24">
      {/* Introduction */}
      <section id="introduction" className="mb-16">
        <SectionHeading id="introduction" level={1}>
          Introduction
        </SectionHeading>

        <SectionHeading id="what-is-beehive" level={2} icon={<Box />}>
          What is BeeHive?
        </SectionHeading>
        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-4">
          BeeHive is a self-hostable, open-source collaboration platform designed to help organizations efficiently manage teams, projects, and workflows from a single unified workspace. It is ideal for startups, hackathon teams, freelance agencies, coding communities, educational groups, and other collaborative environments.
        </p>
        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-4">
          BeeHive is deployed and managed by an administrator for a specific organization or workspace. Each organization can self-host its own instance of BeeHive under its preferred domain or infrastructure, allowing complete control over data, customization, and deployment. For example, a startup can deploy BeeHive to manage its internal operations, while a hackathon team can deploy a separate instance for event collaboration. Although the platform remains the same, each deployment operates independently and is tailored to the needs of its respective organization.
        </p>
        <Callout type="info" title="Note">
          This documentation is a living document and will be updated regularly as new features are released.
        </Callout>

        <SectionHeading id="why-beehive" level={2} icon={<Zap />}>
          Why BeeHive?
        </SectionHeading>
        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-4">
          Managing a project is challenging, but managing multiple projects and teams simultaneously can quickly become overwhelming. As a project manager or team leader, it's essential to have clear visibility into every aspect of your organization's work. Questions such as How much of a project has been completed?, Who is assigned to each project or task?, and What is the current progress across all ongoing projects? become increasingly difficult to answer as the number of projects and team members grows.
        </p>
        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-4">
          In many organizations, project tracking, communication, documentation, and team management are spread across multiple tools. Constantly switching between these platforms reduces productivity, creates information silos, and makes it harder to maintain a clear overview of the organization's progress.
        </p>
        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-4">
          As teams expand, so does the diversity of skills and expertise within the organization. Team members continuously learn new technologies and develop new capabilities. Without a centralized system to track these skills, project managers often miss opportunities to assign the right people to the right tasks, limiting the team's overall efficiency and growth.
        </p>
        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-4">
          BeeHive addresses these challenges by providing a unified, self-hostable collaboration platform where organizations can manage projects, tasks, teams, and communication in one place. It offers real-time project tracking, structured team management, integrated collaboration, and complete visibility into organizational activities, enabling teams to stay organized, make informed decisions, and work more effectively together.
        </p>

        <SectionHeading id="features" level={2} icon={<Sparkles />}>
          Features
        </SectionHeading>
        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-6">
          BeeHive provides a comprehensive set of tools to help organizations manage projects, tasks, teams, and collaboration from a single platform.
        </p>

        <div className="space-y-8 mb-8">
          {/* Project Management */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              Project Management
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-7 mb-3">
              BeeHive enables administrators and project managers to create and assign projects to one or more team members while designating a project manager to oversee their execution. Each project can include a detailed description, deadlines, priority levels, and relevant reference links to provide clear objectives and improve communication.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-7">
              To simplify project tracking, BeeHive allows projects to be divided into multiple components or milestones. Assigned members can mark these components as completed as they progress, giving project managers a real-time overview of the project's status and helping ensure that every stage of development is completed on schedule.
            </p>
          </div>

          {/* Task Management */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              Task Management
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-7 mb-3">
              In addition to managing large projects, BeeHive allows users to create individual tasks for smaller updates, bug fixes, feature requests, or maintenance work. Tasks can be assigned to specific team members, along with a description, deadline, and priority.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-7">
              Once a task has been completed, the assigned member can mark it as complete, allowing managers to easily monitor progress and maintain an up-to-date record of ongoing work.
            </p>
          </div>

          {/* Real-Time Notifications */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              Real-Time Notifications
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-7 mb-3">
              BeeHive keeps everyone informed through a real-time notification system. Users receive instant updates whenever meaningful activity occurs within the organization, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300 mb-3 marker:text-slate-600 dark:marker:text-white">
              <li>Project progress and status updates</li>
              <li>Task assignments and completions</li>
              <li>New member registrations</li>
              <li>Approval of new users</li>
              <li>Team members adding new skills to their profiles</li>
              <li>Other important organizational activities</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-300 leading-7">
              This ensures that managers and team members remain informed without the need for constant manual follow-ups.
            </p>
          </div>

          {/* Organization & Member Management */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              Organization &amp; Member Management
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-7 mb-3">
              BeeHive provides administrators with complete control over their organization's workspace.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-7 mb-3">
              Administrators can review and approve or reject new user registration requests before granting access to the platform, ensuring that only authorized members can join the organization.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-7 mb-3">
              The platform also maintains detailed member profiles, allowing administrators to view information such as:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300 mb-3 marker:text-slate-600 dark:marker:text-white">
              <li>Technical skills and expertise</li>
              <li>Assigned projects</li>
              <li>Assigned tasks</li>
              <li>Role within the organization</li>
              <li>Last active time</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-300 leading-7">
              This centralized overview helps managers better understand the strengths of their team and assign work more effectively.
            </p>
          </div>

          {/* Community Collaboration */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              Community Collaboration
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-7 mb-3">
              To encourage seamless communication, BeeHive includes a built-in Community Chat that allows team members to collaborate without relying on third-party messaging platforms.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-7 mb-3">
              The community chat supports:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300 mb-3 marker:text-slate-600 dark:marker:text-white">
              <li>Real-time messaging</li>
              <li>Message replies</li>
              <li>Emoji reactions</li>
              <li>Image sharing</li>
              <li>Team-wide discussions</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-300 leading-7">
              By bringing communication and project management together in a single platform, BeeHive helps organizations reduce context switching and maintain productive collaboration across their teams.
            </p>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section id="getting-started" className="mb-16">
        <SectionHeading id="getting-started" level={1}>
          Getting Started
        </SectionHeading>

        <SectionHeading id="installation" level={2} icon={<Download />}>
          Installation
        </SectionHeading>
        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-6">
          To get started with BeeHive, you'll need to set up the environment and install dependencies.
        </p>

        <div className="mt-8">
          <a
            href="/installation"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors group"
          >
            Go to Installation
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </section>

      {/* Architecture */}
      <section id="architecture" className="mb-16">
        <SectionHeading id="architecture" level={1}>
          Architecture
        </SectionHeading>

        <SectionHeading id="system-overview" level={2} icon={<Cpu />}>
          System Overview
        </SectionHeading>
        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-4">
          {/* <span className="italic text-slate-400">System overview diagrams and detailed architecture explanation will be added soon.</span> */}
        </p>
        <Callout type="info" title="">
          System overview diagrams and detailed architecture explanation will be added soon.
        </Callout>

        <SectionHeading id="database" level={2} icon={<Database />}>
          Database
        </SectionHeading>
        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-4">
          {/* <span className="italic text-slate-400">Database schema and relations will be added soon.</span> */}
        </p>
        <Callout type="info" title="">
          Database schema and relations will be added soon.
        </Callout>

        <SectionHeading id="authentication" level={2} icon={<Shield />}>
          Authentication
        </SectionHeading>
        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-4">
          {/* <span className="italic text-slate-400">Placeholder for JWT and session management documentation.</span> */}
        </p>
        <Callout type="info" title="">
          Placeholder for JWT and session management documentation.
        </Callout>
        {/* <Callout type="warning" title="Security Requirement">
          Always ensure environment variables for authentication secrets are securely stored and never committed to version control.
        </Callout> */}

        <SectionHeading id="real-time-system" level={2} icon={<Radio />}>
          Real-Time System
        </SectionHeading>
        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-4">
          {/* <span className="italic text-slate-400">Architecture of WebSocket and real-time events handling will be added soon.</span> */}
        </p>
        <Callout type="info" title="">
          Architecture of WebSocket and real-time events handling will be added soon.
        </Callout>
      </section>

      {/* Admin Guide */}
      <section id="admin-guide" className="mb-16">
        <SectionHeading id="admin-guide" level={1}>
          Admin Guide
        </SectionHeading>

        <SectionHeading id="admin-dashboard" level={2}>Dashboard</SectionHeading>
        <p className="text-slate-500 mb-6">The dashboard provides a concise overview of the most important project metrics. It displays the total number of projects and tasks, along with the number of completed projects and tasks. Additionally, it highlights the most recently created projects and tasks, allowing admin to quickly track ongoing work and recent activity.</p>
        <div className="my-6 overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">
          <img
            src="/features/adminDash.png"
            alt="Admin Dashboard"
            className="w-full object-cover"
          />
        </div>

        <SectionHeading id="admin-members" level={2}>Members</SectionHeading>
        <p className="text-slate-500 mb-6">The Members section provides a comprehensive view of everyone in your organization. You can filter members by team to quickly find the people you're looking for. Click on View Details to access a member's complete profile, including their role, team, and other relevant information. Additionally, administrators can review and approve or reject requests from users who wish to join the organization, ensuring secure and controlled team management.</p>
        <div className="my-6 overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">
          <img
            src="/features/members1.png"
            alt="Admin Members"
            className="w-full object-cover"
          />
        </div>

        <div className="my-6 overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">
          <img
            src="/features/members2.png"
            alt="Admin Dashboard"
            className="w-full object-cover"
          />
        </div>

        <div className="my-6 overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">
          <img
            src="/features/members3.png"
            alt="Admin Dashboard"
            className="w-full object-cover"
          />
        </div>

        <SectionHeading id="admin-projects" level={2}>Projects</SectionHeading>
        <p className="text-slate-500 mb-6">The Projects section provides a clear overview of all ongoing and completed projects. You can easily filter projects by their status to focus on active or completed work. Each project displays its completion percentage, allowing you to monitor progress at a glance. Click on View Details to access comprehensive project information, including tasks, team members, and milestones. Administrators also have the ability to delete projects when they are no longer needed.</p>
        <div className="my-6 overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">
          <img
            src="/features/project.png"
            alt="Admin Dashboard"
            className="w-full object-cover"
          />
        </div>
        <SectionHeading id="admin-tasks" level={2}>Tasks</SectionHeading>
        <p className="text-slate-500 mb-6">The Tasks section functions similarly to the Projects section but is designed for managing smaller, individual pieces of work. You can create, assign, and track tasks for specific team members without the overhead of creating a full project. Each task includes progress tracking, status updates, and detailed information, making it easy to manage day-to-day work efficiently.</p>
        <div className="my-6 overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">
          <img
            src="/features/task.png"
            alt="Admin Dashboard"
            className="w-full object-cover"
          />
        </div>
        <SectionHeading id="admin-notification" level={2}>Notification</SectionHeading>
        <p className="text-slate-500 mb-6">The Notification Center keeps administrators informed about important activities across the organization. It provides real-time notifications for key events, such as new member requests, project updates, task assignments, and other significant actions. The screenshot below showcases the different types of notifications available, helping administrators stay updated and respond promptly.</p>
        <div className="my-6 overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">
          <img
            src="/features/notify.png"
            alt="Admin Dashboard"
            className="w-full object-cover"
          />
        </div>
        <SectionHeading id="admin-community" level={2}>Community</SectionHeading>
        <p className="text-slate-500 mb-6">The Community section is designed to foster collaboration and engagement among team members. Members can share updates, reply to messages, and react with emojis to encourage meaningful discussions. To maintain a healthy and organized environment, administrators have the authority to delete messages for everyone whenever necessary.</p>
        <div className="my-6 overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">

          <img
            src="/features/community.png"
            alt="Admin Dashboard"
            className="w-full object-cover"
          />
        </div>
      </section>

      {/* User Guide */}
      <section id="user-guide" className="mb-16">
        <SectionHeading id="user-guide" level={1}>
          User Guide
        </SectionHeading>

        <SectionHeading id="user-dashboard" level={2}>Dashboard</SectionHeading>
        <p className="text-slate-500 mb-6">The User Dashboard is similar to the Admin Dashboard. It displays the total number of projects and tasks assigned to the user, along with the number that have been completed. The dashboard also shows the most recently assigned projects and tasks. Moreover, users can update their profile and keep their skills inventory up to date.</p>
        <div className="my-6 overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">
          <img
            src="/features/userdash.png"
            alt="Admin Dashboard"
            className="w-full object-cover"
          />
        </div>

        <div className="my-6 overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">
          <img
            src="/features/userprofile.png"
            alt="Admin Dashboard"
            className="w-full object-cover"
          />
        </div>
        <SectionHeading id="user-projects" level={2}>Projects</SectionHeading>
        <p className="text-slate-500 mb-6">The Projects section displays all projects assigned to the user, along with key details in each project card. For additional information and available actions, click on <i><b>View Details</b></i>. This opens the project's description and its associated components, each with a checkbox. Users can mark individual components as completed as they finish them. Selecting <i><b>Mark Project as Completed</b></i> automatically marks all project components as completed.</p>
        <div className="my-6 overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">
          <img
            src="/features/userproj.png"
            alt="Admin Dashboard"
            className="w-full object-cover"
          />
        </div>

        <div className="my-6 overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">
          <img
            src="/features/userprojdetails.png"
            alt="Admin Dashboard"
            className="w-full object-cover"
          />
        </div>
        <SectionHeading id="user-tasks" level={2}>Tasks</SectionHeading>
        <p className="text-slate-500 mb-6">The Tasks section displays all tasks assigned to the user. The task details are presented in a simple and concise format, providing only the essential information for quick understanding and efficient task management.</p>
        <div className="my-6 overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">
          <img
            src="/features/usertask.png"
            alt="Admin Dashboard"
            className="w-full object-cover"
          />
        </div>
        <SectionHeading id="user-notification" level={2}>Notification</SectionHeading>
        <p className="text-slate-500 mb-6">The Notifications section helps users stay informed about activities initiated by the administrator. It ensures that users do not miss any important updates and keeps them informed about the latest actions relevant to them.</p>
        <div className="my-6 overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">
          <img
            src="/features/usernotify.png"
            alt="Admin Dashboard"
            className="w-full object-cover"
          />
        </div>
        <SectionHeading id="user-community" level={2}>Community</SectionHeading>
        <p className="text-slate-500 mb-6">The Community section in the User Workspace serves the same purpose as it does in the Admin Workspace. Users can chat with team members, reply to messages, react with emojis, and delete their own messages. They can also share images to make their messages more descriptive and easier to understand.</p>
        <div className="my-6 overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">
          <img
            src="/features/community.png"
            alt="Admin Dashboard"
            className="w-full object-cover"
          />
        </div>
      </section>

      {/* Developer Guide */}
      <section id="developer-guide" className="mb-16">
        <SectionHeading id="developer-guide" level={1}>
          Developer Guide
        </SectionHeading>

        <SectionHeading id="folder-structure" level={2} icon={<FolderTree />}>Folder Structure</SectionHeading>
        <CodeBlock
          filename="Project Structure"
          code={`beehive/
├── main.py                    # FastAPI application entry point
├── templates_jinja.py         # Jinja2 template setup & configuration
├── requirements.txt           # Python backend dependencies
├── README.md                  # Project documentation & overview
├── .env                       # Environment variables (Database URL, API keys)
│
├── app/                       # FastAPI application module
│   ├── rtc.py                 # Real-time WebSocket communication handler
│   ├── routes/                # Backend API & page routes
│   │   ├── community.py       # Community chat & messaging API
│   │   ├── admin/             # Administrator routes
│   │   │   ├── dashboard.py   # Admin metrics & analytics
│   │   │   ├── pendings.py    # Registration approval requests
│   │   │   ├── profiles.py    # User profile management
│   │   │   ├── projects.py    # Project CRUD operations
│   │   │   └── tasks.py       # Global task assignments
│   │   └── clients/           # Client/Member routes
│   │       ├── dashboard.py   # Personal dashboard API
│   │       ├── entry.py       # Authentication & onboarding
│   │       ├── projects.py    # Member project tracking
│   │       └── tasks.py       # Member task updates
│   ├── static/                # Static assets (CSS, JS, images for Jinja UI)
│   └── templates/             # Jinja2 HTML templates
│       ├── home.html          # Main landing template
│       ├── admin/             # Admin workspace views
│       └── clients/           # Client workspace views
│
├── configs/                   # Application configurations
│   ├── trendyDB.py            # MongoDB client & database configuration
│   ├── cloudinary_config.py   # Image upload configuration
│   ├── access_configs.py     # Authentication tokens config
│   ├── devConfig.py           # Developer debug settings
│   └── otp_configs.py         # OTP & email verification settings
│
├── schemas/                   # Pydantic data validation schemas
│   ├── adminProjectSchemas.py # Admin project payload validation
│   ├── adminTasksSchemas.py   # Admin task payload validation
│   ├── loginSchemas.py        # Auth & login schemas
│   ├── messageSystemSchemas.py# Chat message schemas
│   ├── updatePjtSchemas.py    # Project update schemas
│   └── updateTskSchema.py     # Task update schemas
│
├── security/                  # Security & Encryption utilities
│   ├── encryptPass.py         # Password hashing logic
│   └── decryptPass.py         # Password verification logic
│
└── utils/                     # Backend helper functions & business logic
    ├── adminGets.py           # Database fetching helpers for admin
    ├── adminPosts.py          # Database creation helpers for admin
    ├── adminPuts.py           # Database update helpers for admin
    ├── clientGets.py          # Member fetching helpers
    ├── clientPost.py          # Member creation helpers
    ├── clientPuts.py          # Member update helpers
    ├── general.py             # General utility routines
    ├── IST.py                 # Timezone & date utilities
    └── messageSystem.py       # Real-time message dispatching helpers`}
        />

        <SectionHeading id="api" level={2} icon={<Code2 />}>API Reference</SectionHeading>
        {/* <p className="text-slate-500 mb-6">REST and GraphQL endpoint documentation goes here.</p> */}
        <Callout type="info" title="Under Development">
          Detailed documentation for all REST API endpoints are currently being prepared and will be available in upcoming releases.
        </Callout>

        <SectionHeading id="dev-database" level={2} icon={<Database />}>Database Schema</SectionHeading>
        {/* <p className="text-slate-500 mb-6">ORM models and migration guides.</p> */}
        <Callout type="info" title="Under Development">
          Complete data model, collection relationships, and schema documentation are currently being prepared and will be available in upcoming releases.
        </Callout>
        <SectionHeading id="environment-variables" level={2} icon={<KeyRound />}>Environment Variables</SectionHeading>
        <CodeBlock
          filename=".env.example"
          language="bash"
          code={`# Database Configuration
MONGO_URI="mongodb+srv://<username>:<password>@<cluster-name>.<cluster-id>.mongodb.net/<database-name>?retryWrites=true&w=majority"

# Email Service (SendGrid)
SENDGRID_API_KEY="SG.your_sendgrid_api_key_here"
EMAIL="notifications@yourdomain.com"

# Documentation Access Credentials
DOC_USERNAME="doc_admin"
DOC_PASSWORD="your_secure_doc_password"

# Workspace Admin Credentials
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your_secure_admin_password"

# Cloud Storage (Cloudinary)
CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_SECRET_KEY="your_cloudinary_secret_key"`}
        />

        <SectionHeading id="contributing" level={2}>Contributing</SectionHeading>
        {/* <p className="text-slate-500 mb-6">Guidelines for submitting PRs and code style rules.</p> */}
        <Callout type="info" title="Under Development">
          Development workflow, coding standards and contribution guidelines are currently being prepared and will be available in upcoming releases.
        </Callout>
        <SectionHeading id="deployment" level={2}>Deployment</SectionHeading>
        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-6">
          To get started with BeeHive, you'll need to set up the environment and install dependencies.
        </p>

        <div className="mt-8">
          <a
            href="/installation"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors group"
          >
            Go to Installation
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </section>

      {/* Reference */}
      <section id="reference" className="mb-16">
        <SectionHeading id="reference" level={1}>
          Reference
        </SectionHeading>

        <SectionHeading id="faq" level={2} icon={<HelpCircle />}>FAQ</SectionHeading>
        <div className="space-y-4 my-6">
          {[
            { q: "Is BeeHive really free and open source?", a: "Yes. BeeHive is MIT licensed. You can read, fork, modify, and self-host it forever, at no cost." },
            { q: "Where does my data live?", a: "Wherever you deploy it. BeeHive runs on your own infrastructure or Render, Vercel, AWS etc." },
            { q: "Do I need to be a developer to run it?", a: "No. You don't need to be a developer, simply follow the setup instructions to get started." },
            { q: "Does BeeHive support real-time updates?", a: "Yes. Presence, task updates, and chat are all real-time out of the box." },
            { q: "Can I customize or extend BeeHive?", a: "Absolutely. The codebase is modular. Replace, extend, or theme any part of it." },
            { q: "How does it compare to hosted tools?", a: "You get similar functionality without vendor lock-in, subscription fees, or data risk." },
          ].map((faq, index) => (
            <div
              key={index}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"
            >
              <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 mb-2">
                {faq.q}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <SectionHeading id="troubleshooting" level={2} icon={<LifeBuoy />}>Troubleshooting</SectionHeading>
        {/* <p className="text-slate-500 mb-6">Common issues and their solutions.</p> */}
        <Callout type="info" title="Available Soon">
          The Troubleshooting section is currently under development. As BeeHive continues to evolve, we are identifying common issues and documenting verified solutions to ensure this guide remains accurate and helpful. It will be added in a future update.
        </Callout>
        <SectionHeading id="changelog" level={2} icon={<History />}>Changelog</SectionHeading>
        {/* <p className="text-slate-500 mb-6">Version history and release notes.</p> */}
        <Callout type="info" title="Available Soon">
          The Changelog will be published once BeeHive reaches its first stable release. It will include version history, newly introduced features, improvements, bug fixes, and breaking changes to help users track the project's development over time.
        </Callout>
        <SectionHeading id="roadmap" level={2} icon={<Milestone />}>Roadmap</SectionHeading>
        {/* <p className="text-slate-500 mb-6">Upcoming features and planned improvements.</p> */}
        <Callout type="info" title="Available Soon">
          Upcoming features and planned improvements will be available soon.
        </Callout>

        <SectionHeading id="license" level={2} icon={<Scale />}>License</SectionHeading>
        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-4">
          BeeHive is open-source software licensed under the <strong>MIT License</strong>.
        </p>
        <CodeBlock
          filename="LICENSE"
          language="text"
          code={`MIT License

Copyright (c) 2026 BeeHive Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
        />
      </section>

    </div>
  );
}
