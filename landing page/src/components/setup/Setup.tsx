import React, { useState, useMemo, useEffect } from "react";
import { Menu, X, Moon, Sun, ChevronRight, Settings, Database, Mail, Image, KeyRound, Cloud, Box, Server } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "../documentation/ui/SectionHeading";
import { Callout } from "../documentation/ui/Callout";
import { CodeBlock } from "../documentation/ui/CodeBlock";
import { useScrollSpy } from "../documentation/hooks/useScrollSpy";
import { setupConfig, NavItem } from "./config";

// --- Theme Toggle ---
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

// --- Sidebar Navigation ---
function SetupSidebarNavigation() {
    const itemIds = useMemo(() => {
        const ids: string[] = [];
        setupConfig.sidebarNav.forEach((section) => {
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
            {setupConfig.sidebarNav.map((item, index) => (
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

function SidebarGroup({ item, activeId, defaultExpanded = false }: { item: NavItem; activeId: string; defaultExpanded?: boolean }) {
    const isSectionActive = item.href.substring(1) === activeId ||
        item.items?.some(i => i.href.substring(1) === activeId);

    const [isExpanded, setIsExpanded] = useState(defaultExpanded || isSectionActive);

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
                                                layoutId="active-indicator-setup"
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

// --- Table of Contents ---
function SetupTableOfContents() {
    const itemIds = useMemo(() => {
        const ids: string[] = [];
        setupConfig.sidebarNav.forEach((section) => {
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
        <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                On this page
            </h4>
            <ul className="space-y-2.5 text-sm">
                {setupConfig.sidebarNav.map((section) => {
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

// --- Content ---
function SetupContent() {
    return (
        <div className="w-full max-w-4xl mx-auto pb-24">
            <section id="setup" className="mb-16">
                <SectionHeading id="setup" level={1}>
                    Setup
                </SectionHeading>

                <SectionHeading id="overview" level={2} icon={<Settings />}>
                    Overview
                </SectionHeading>
                <p className="text-slate-600 dark:text-slate-300 leading-7 mb-4">
                    Welcome to the BeeHive Setup Guide. This guide will walk you through setting up all necessary external dependencies and third-party services required to run BeeHive. From configuring your database to setting up email notifications and cloud storage, we've got you covered.
                </p>

                <SectionHeading id="mongodb" level={2} icon={<Database />}>
                    MongoDB
                </SectionHeading>
                <p className="text-slate-600 dark:text-slate-300 leading-7 mb-4">
                    First, we'll obtain the MongoDB URI from MongoDB Atlas. This URI is required to connect BeeHive to your database and perform database operations. Follow the steps below to generate and retrieve your MongoDB connection URI.
                </p>

                <div className="my-6">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Watch this tutorial for better understanding:
                    </p>
                    <div className="w-full max-w-2xl aspect-video rounded-xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800 bg-black">
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/7a2Nns23d_s"
                            title="Watch this tutorial for better understanding."
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>

                <div className="space-y-6 mb-8">
                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Step 1: Create a MongoDB Atlas Account</h4>
                        <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-300 marker:text-slate-600 dark:marker:text-white">
                            <li>Visit the <a href="https://www.mongodb.com/cloud/atlas" target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">MongoDB Atlas website</a>.</li>
                            <li>Sign up for a new account or log in if you already have one.</li>
                            <li>After signing in, click <strong>Create</strong> or <strong>New Project</strong>.</li>
                            <li>Enter a project name (e.g., <code className="text-sm bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">BeeHive</code>) and click <strong>Create Project</strong>.</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Step 2: Create a Free Cluster</h4>
                        <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-300 marker:text-slate-600 dark:marker:text-white">
                            <li>Inside your project, click <strong>Create a Deployment</strong> or <strong>Build a Database</strong>.</li>
                            <li>Select the <strong>M0 (Free)</strong> cluster.</li>
                            <li>Choose your preferred Cloud Provider (AWS, Google Cloud, or Azure) and Region (closest to your users).</li>
                            <li>Give your cluster a name or keep the default.</li>
                            <li>Click <strong>Create Deployment</strong> and wait a few minutes for the cluster to be provisioned.</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Step 3: Create a Database User</h4>
                        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-2">
                            After the cluster is created, Atlas will prompt you to create a database user.
                        </p>
                        <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-300 marker:text-slate-600 dark:marker:text-white mb-3">
                            <li>Enter a <strong>Username</strong>.</li>
                            <li>Enter a strong <strong>Password</strong>.</li>
                            <li>Save these credentials securely, as they will be required later.</li>
                            <li>Click <strong>Create Database User</strong>. Atlas requires a database user before applications can connect.</li>
                        </ul>
                        <Callout type="warning" title="Important">
                            Do not lose your username or password. BeeHive will use these credentials to connect to your database.
                        </Callout>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Step 4: Configure Network Access</h4>
                        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-2">
                            MongoDB Atlas only accepts connections from approved IP addresses.
                        </p>
                        <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-300 marker:text-slate-600 dark:marker:text-white mb-3">
                            <li>When prompted, click <strong>Add IP Address</strong>.</li>
                            <li>Select <strong>Allow Access from Anywhere</strong>. Atlas will automatically add <code className="text-sm bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">0.0.0.0/0</code>.</li>
                            <li>Click <strong>Confirm</strong> or <strong>Save</strong>.</li>
                        </ul>
                        <p className="text-slate-600 dark:text-slate-300 leading-7 text-sm mb-3">
                            This allows connections from any IP address, which is convenient during development.
                        </p>
                        <Callout type="warning" title="Production Recommendation">
                            For production deployments, avoid using <code className="text-sm bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">0.0.0.0/0</code>. Instead, whitelist only the public IP address of your server to improve security.
                        </Callout>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Step 5: Obtain the Connection URI</h4>
                        <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-300 marker:text-slate-600 dark:marker:text-white mb-3">
                            <li>Go to <strong>Database</strong>.</li>
                            <li>Locate your cluster and click <strong>Connect</strong>.</li>
                            <li>Select <strong>Drivers</strong> as the connection method.</li>
                            <li>Choose your preferred driver version (the latest version is recommended).</li>
                            <li>Atlas will display a connection string similar to:</li>
                        </ul>
                        <CodeBlock
                            filename="Connection String"
                            language="text"
                            code={`mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`}
                        />
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Step 6: Replace the Placeholders</h4>
                        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-2">
                            Replace the placeholders with the credentials you created earlier.
                        </p>
                        <CodeBlock
                            filename="Example URI"
                            language="text"
                            code={`mongodb+srv://beehive_admin:MyStrongPassword123@cluster0.xxxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`}
                        />
                        <Callout type="info" title="Special Characters Note">
                            If your password contains special characters such as <code className="text-sm bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">@</code>, <code className="text-sm bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">:</code>, <code className="text-sm bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">/</code>, <code className="text-sm bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">?</code>, or <code className="text-sm bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">#</code>, URL-encode them before inserting them into the URI to avoid connection errors.
                        </Callout>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Step 7: Add the URI to BeeHive</h4>
                        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-2">
                            Open your <code className="text-sm bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">.env</code> file and add:
                        </p>
                        <CodeBlock
                            filename=".env"
                            language="bash"
                            code={`MONGO_URI=mongodb+srv://beehive_admin:MyStrongPassword123@cluster0.xxxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`}
                        />
                        <p className="text-slate-600 dark:text-slate-300 leading-7 mt-3">
                            BeeHive will use this environment variable to establish a secure connection to your MongoDB Atlas database.
                        </p>
                    </div>
                </div>

                <SectionHeading id="sendgrid" level={2} icon={<Mail />}>
                    Sendgrid
                </SectionHeading>
                <p className="text-slate-600 dark:text-slate-300 leading-7 mb-4">
                    BeeHive uses Twilio SendGrid to send emails for features such as email verification, password resets, and notifications. Before running the application, you need to create a SendGrid API key.
                </p>

                <div className="my-6">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Watch this tutorial for better understanding:
                    </p>
                    <div className="w-full max-w-2xl aspect-video rounded-xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800 bg-black">
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/PaW9szcXqGs"
                            title="Watch this tutorial for better understanding."
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>

                <div className="space-y-6 mb-8">
                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Step 1: Create a SendGrid Account</h4>
                        <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-300 marker:text-slate-600 dark:marker:text-white mb-3">
                            <li>Visit the <a href="https://sendgrid.com/" target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">Twilio SendGrid Dashboard</a>.</li>
                            <li>Sign up for a new account or log in to your existing account.</li>
                            <li>Complete the account verification process if prompted.</li>
                        </ul>
                        <Callout type="info" title="Note">
                            Depending on your account status, SendGrid may require email or identity verification before allowing email sending.
                        </Callout>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Step 2: Navigate to API Keys</h4>
                        <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-300 marker:text-slate-600 dark:marker:text-white">
                            <li>From the SendGrid Dashboard, open the left navigation menu.</li>
                            <li>Go to <strong>Settings</strong> &rarr; <strong>API Keys</strong>.</li>
                            <li>Click <strong>Create API Key</strong>.</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Step 3: Create a New API Key</h4>
                        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-2">
                            Enter a descriptive name for your API key, such as <code className="text-sm bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">BeeHive Production</code> or <code className="text-sm bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">BeeHive Development</code>.
                        </p>
                        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-2">
                            Select the appropriate permission level:
                        </p>
                        <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-300 marker:text-slate-600 dark:marker:text-white">
                            <li><strong>Full Access</strong> (Recommended for quick setup)</li>
                            <li><strong>Restricted Access (Custom Access)</strong> and enable the <strong>Mail Send</strong> permission if you prefer to follow the principle of least privilege.</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Step 4: Generate the API Key</h4>
                        <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-300 marker:text-slate-600 dark:marker:text-white mb-3">
                            <li>Click <strong>Create & View</strong>.</li>
                            <li>SendGrid will generate your API key (e.g. <code className="text-sm bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">SG.xxxxxxxx...</code>).</li>
                        </ul>
                        <Callout type="warning" title="Important">
                            This is the only time SendGrid will display the complete API key. Copy it immediately and store it securely. If you lose it, you must generate a new API key because SendGrid cannot display it again.
                        </Callout>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Step 5: Add the API Key to BeeHive</h4>
                        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-2">
                            Open your <code className="text-sm bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">.env</code> file and add:
                        </p>
                        <CodeBlock
                            filename=".env"
                            language="bash"
                            code={`SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}
                        />
                        <p className="text-slate-600 dark:text-slate-300 leading-7 mt-2">
                            Replace the example value with your actual API key.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Step 6: Verify Your Sender Identity (Required)</h4>
                        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-2">
                            Before SendGrid can send emails, you must verify the email address or domain you will use as the sender.
                        </p>
                        <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-300 marker:text-slate-600 dark:marker:text-white mb-3">
                            <li>In the SendGrid Dashboard, go to <strong>Settings</strong> &rarr; <strong>Sender Authentication</strong>.</li>
                            <li>Choose <strong>Single Sender Verification</strong> (Recommended for development/testing) or <strong>Domain Authentication</strong> (Recommended for production).</li>
                            <li>Follow the on-screen instructions to complete the verification process.</li>
                        </ul>
                        <Callout type="info" title="Verification Note">
                            BeeHive cannot send emails until the sender identity has been verified.
                        </Callout>
                    </div>

                    <Callout type="info" title="You're Ready!">
                        You have successfully generated your SendGrid API key and configured it for BeeHive. The application can now authenticate with SendGrid to send emails securely.
                    </Callout>
                </div>

                <SectionHeading id="cloudinary" level={2} icon={<Image />}>
                    Cloudinary
                </SectionHeading>
                <p className="text-slate-600 dark:text-slate-300 leading-7 mb-4">
                    BeeHive uses Cloudinary to securely store and manage images uploaded by users. Before running the application, you need to obtain your Cloud Name, API Key, and API Secret.
                </p>

                <div className="my-6">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Watch this tutorial for better understanding:
                    </p>
                    <div className="w-full max-w-2xl aspect-video rounded-xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800 bg-black">
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/ok9mHOuvVSI"
                            title="Watch this tutorial for better understanding."
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>

                <div className="space-y-6 mb-8">
                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Step 1: Create a Cloudinary Account</h4>
                        <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-300 marker:text-slate-600 dark:marker:text-white">
                            <li>Visit the <a href="https://cloudinary.com/console" target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">Cloudinary Console</a>.</li>
                            <li>Sign up for a free account or log in if you already have one.</li>
                            <li>Complete the account verification process if prompted.</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Step 2: Find Your Cloud Name</h4>
                        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-2">
                            After logging in, you will be taken to the Dashboard. Under the <strong>Product Environment</strong> section, locate your <strong>Cloud Name</strong> (e.g. <code className="text-sm bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">my-cloud-name</code>).
                        </p>
                        <p className="text-slate-600 dark:text-slate-300 leading-7 text-sm">
                            Your Cloud Name is used to identify your Cloudinary environment and is included in every media URL.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Step 3: Open the API Keys Page</h4>
                        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-2">
                            From the Dashboard, click <strong>Go to API Keys</strong>, or navigate via the left sidebar to <strong>Settings</strong> &rarr; <strong>API Keys</strong>.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Step 4: Copy Your API Key</h4>
                        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-2">
                            On the API Keys page, locate the <strong>API Key</strong> and copy the value (e.g. <code className="text-sm bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">123456789012345</code>).
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Step 5: Reveal and Copy Your API Secret</h4>
                        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-2">
                            On the same page, locate the <strong>API Secret</strong>. Click <strong>Show</strong> (or the eye icon), verify your password if prompted, and copy the API Secret (e.g. <code className="text-sm bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">abcdefghijklmnopqrstuvwxyz123456</code>).
                        </p>
                        <Callout type="warning" title="Important">
                            Never expose your API Secret in client-side code or commit it to a public Git repository. It should always remain on your server or in environment variables.
                        </Callout>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Step 6: Add the Credentials to BeeHive</h4>
                        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-2">
                            Open your <code className="text-sm bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">.env</code> file and add the following variables:
                        </p>
                        <CodeBlock
                            filename=".env"
                            language="bash"
                            code={`CLOUD_NAME=my-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_SECRET_KEY=abcdefghijklmnopqrstuvwxyz123456`}
                        />
                        <p className="text-slate-600 dark:text-slate-300 leading-7 mt-2">
                            Replace the example values with your own Cloudinary credentials.
                        </p>
                    </div>

                    <Callout type="info" title="You're Ready!">
                        You have successfully obtained your Cloudinary credentials. BeeHive can now securely upload, manage, and serve media files using your Cloudinary account.
                    </Callout>
                </div>

                <SectionHeading id="environment-variables" level={2} icon={<KeyRound />}>
                    Environment Variables
                </SectionHeading>
                <p className="text-slate-600 dark:text-slate-300 leading-7 mb-4">
                    If you have completed all the above steps then copy the <code className="text-sm bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">.env.example</code> file to <code className="text-sm bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">.env</code> and fill in the required values.
                </p>
                <Callout type="warning" title="Important">
                    Add <b>?retryWrites=true&w=majority&maxIdleTimeMS=10000</b> after <b>mongodb.net/</b>.
                </Callout>
                <CodeBlock
                    filename=".env"
                    language="bash"
                    code={`MONGO_URI = "mongodb+srv://<username>:<password>@<cluster-name>.<cluster-id>.mongodb.net/?retryWrites=true&w=majority&maxIdleTimeMS=10000"
SENDGRID_API_KEY = "your_sendgrid_key"
EMAIL = "your_verified_sender_email@domain.com"

DOC_USERNAME = "docs_user"
DOC_PASSWORD = "docs_password"

ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin_secure_password"

CLOUD_NAME = "your_cloud_name"
CLOUDINARY_API_KEY = "your_cloudinary_key"
CLOUDINARY_SECRET_KEY = "your_cloudinary_secret"

PYTHON_VERSION = "3.10.13"`}
                />
            </section>


            <section id="deployment" className="mb-16">
                <SectionHeading id="deployment" level={1}>
                    Deployment
                </SectionHeading>

                <SectionHeading id="render" level={2} icon={<Server />}>
                    Render
                </SectionHeading>
                <p className="text-slate-600 dark:text-slate-300 leading-7 mb-4">
                    Render provides an easy way to deploy and host the BeeHive. Follow the steps below to set up and deploy your backend service on Render.
                </p>

                <div className="space-y-6 mb-8">
                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Step 1: Fork the Repository</h4>
                        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-2">
                            Fork the official BeeHive repository on GitHub to your own GitHub account so Render can access and deploy your codebase.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Step 2: Create a Render Account</h4>
                        <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-300 marker:text-slate-600 dark:marker:text-white">
                            <li>Visit the <a href="https://render.com/" target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">Render Dashboard</a>.</li>
                            <li>Sign up or log in.</li>
                            <li>Connect your GitHub account when prompted and authorize Render to access your forked BeeHive repository.</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Step 3: Create a New Web Service</h4>
                        <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-300 marker:text-slate-600 dark:marker:text-white">
                            <li>From the Render Dashboard, click <strong>New +</strong>.</li>
                            <li>Select <strong>Web Service</strong>.</li>
                            <li>Choose your forked GitHub repository and click <strong>Connect</strong> next to it.</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Step 4: Configure the Web Service</h4>
                        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-3">
                            Fill in the service configuration details:
                        </p>
                        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 mb-4">
                            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold border-b border-slate-200 dark:border-slate-800">
                                    <tr>
                                        <th className="px-4 py-2.5">Setting</th>
                                        <th className="px-4 py-2.5">Value</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    <tr>
                                        <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-slate-100">Name</td>
                                        <td className="px-4 py-2.5">Your preferred service name (e.g., <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">xyzorganization</code>)</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-slate-100">Language</td>
                                        <td className="px-4 py-2.5">Python 3</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-slate-100">Root Directory</td>
                                        <td className="px-4 py-2.5">Keep it empty</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-slate-100">Branch</td>
                                        <td className="px-4 py-2.5"><code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">main</code> (or your deployment branch)</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-slate-100">Region</td>
                                        <td className="px-4 py-2.5">Choose the nearest region</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-slate-100">Instance Type</td>
                                        <td className="px-4 py-2.5">Free or Paid (depending on your needs)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Step 5: Configure the Build Command</h4>
                        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-2">
                            Set the Build Command to:
                        </p>
                        <CodeBlock
                            filename="Build Command"
                            language="bash"
                            code={`pip install -r requirements.txt`}
                        />
                        <p className="text-slate-600 dark:text-slate-300 leading-7 text-sm mt-2">
                            Render installs all Python dependencies listed in your <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">requirements.txt</code> file during each deployment.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Step 6: Configure the Start Command</h4>
                        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-2">
                            Enter the following Start Command:
                        </p>
                        <CodeBlock
                            filename="Start Command"
                            language="bash"
                            code={`uvicorn main:app --host 0.0.0.0 --port $PORT`}
                        />
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Step 7: Add Environment Variables</h4>
                        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-2">
                            Open the <strong>Environment</strong> section in your Render Web Service settings and add all required environment variables (<code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">MONGO_URI</code>, <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">SENDGRID_API_KEY</code>, <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">CLOUD_NAME</code>, etc.).
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Step 8: Deploy the Application</h4>
                        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-2">
                            After verifying all settings, click <strong>Create Web Service</strong>. Render will automatically:
                        </p>
                        <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-300 marker:text-slate-600 dark:marker:text-white">
                            <li>Clone your repository</li>
                            <li>Install dependencies</li>
                            <li>Build the application</li>
                            <li>Start your BeeHive server</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Step 9: Access Your Application</h4>
                        <p className="text-slate-600 dark:text-slate-300 leading-7 mb-2">
                            Once the deployment is complete, Render will provide a public URL similar to:
                        </p>
                        <CodeBlock
                            filename="Public URL"
                            language="text"
                            code={`https://xyzorganization.onrender.com`}
                        />
                        <p className="text-slate-600 dark:text-slate-300 leading-7 mt-3">
                            Open the URL in your browser to verify that the application is running successfully.
                        </p>
                    </div>
                </div>

                <SectionHeading id="vercel" level={2} icon={<Box />}>
                    Vercel
                </SectionHeading>
                {/* <p className="text-slate-600 dark:text-slate-300 leading-7 mb-4">
                    Vercel is the recommended platform for deploying the BeeHive frontend. Simply import your repository, select the Next.js/React preset, and Vercel will handle the rest, providing you with a global CDN and continuous deployment.
                </p> */}
                <Callout type="info" title="Available Soon.">
                    Steps to deploy on vercel will be available soon.
                </Callout>

                <SectionHeading id="aws" level={2} icon={<Cloud />}>
                    AWS
                </SectionHeading>
                {/* <p className="text-slate-600 dark:text-slate-300 leading-7 mb-4">
                    For enterprise-grade deployments, you can deploy BeeHive on AWS. We recommend using Amazon ECS for container orchestration, Amazon DocumentDB (with MongoDB compatibility) for the database, and Application Load Balancers for traffic routing.
                </p> */}
                <Callout type="info" title="Available Soon.">
                    Steps to deploy on AWS will be available soon.
                </Callout>
            </section>
        </div>
    );
}

// --- Main Layout ---
export function Setup() {
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
                    <SetupSidebarNavigation />
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
                                <div onClick={() => setIsMobileOpen(false)}>
                                    <SetupSidebarNavigation />
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
                                Set Up Your Environment. Deploy Anywhere.
                            </p>
                            <div className="flex flex-wrap justify-center gap-2.5 mt-6">
                                {[
                                    { category: "database", name: "MongoDB", bg: "bg-[#47A248]", text: "text-white" },
                                    { category: "images", name: "Cloudinary", bg: "bg-[#3448C5]", text: "text-white" },
                                    { category: "email", name: "SendGrid", bg: "bg-[#1A82E2]", text: "text-white" },
                                    { category: "deploy", name: "Render", bg: "bg-black", text: "text-white" },
                                    { category: "deploy", name: "Vercel", bg: "bg-black", text: "text-white" },
                                    { category: "cloud", name: "AWS", bg: "bg-[#FF9900]", text: "text-slate-950" },
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

                        <SetupContent />
                    </div>
                </main>

                {/* Right Sidebar (Table of Contents) */}
                <aside className="hidden text-sm xl:block">
                    <div className="sticky top-16 -mt-10 h-[calc(100vh-4rem)] overflow-y-auto pt-16 pb-10">
                        <SetupTableOfContents />
                    </div>
                </aside>
            </div>
        </div>
    );
}