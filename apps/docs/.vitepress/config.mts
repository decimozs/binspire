import { DefaultTheme, defineConfig } from "vitepress";

const sidebars = (): DefaultTheme.SidebarItem[] => [
  {
    text: "Concepts",
    collapsed: true,
    items: [
      { text: "Motivation", link: "/docs/concepts/motivation" },
      { text: "Challenges", link: "/docs/concepts/challenges" },
      { text: "IoT", link: "/docs/concepts/iot" },
      { text: "Principles", link: "/docs/concepts/principles" },
      { text: "Impact", link: "/docs/concepts/impact" },
      { text: "Automation", link: "/docs/concepts/automation" },
      {
        text: "Experience",
        link: "/docs/concepts/experience",
      },
    ],
  },
  {
    text: "Getting Started",
    collapsed: true,
    items: [
      { text: "Installation", link: "/docs/getting-started/installation" },
      { text: "Quick Start", link: "/docs/getting-started/quick-start" },
      { text: "Configuration", link: "/docs/getting-started/configuration" },
    ],
  },
  {
    text: "Guides",
    collapsed: true,
    items: [
      { text: "Account", link: "/docs/guides/account" },
      { text: "Dashboard", link: "/docs/guides/dashboard" },
      { text: "Monitoring", link: "/docs/guides/monitoring" },
      {
        text: "Alerts & Notifications",
        link: "/docs/guides/alerts-notifications",
      },
      {
        text: "Data Analysis & Reports",
        link: "/docs/guides/data-analysis-reports",
      },
      { text: "Troubleshooting", link: "/docs/guides/troubleshooting" },
      { text: "Permissions", link: "/docs/guides/permissions" },
      { text: "Settings", link: "/docs/guides/settings" },
    ],
  },
];

export default defineConfig({
  lang: "en-US",
  title: "Binspire",
  description:
    "A SWMS to make waste collection more efficient, sustainable, and transparent.",
  ignoreDeadLinks: true,
  cleanUrls: true,
  themeConfig: {
    nav: [{ text: "Docs", link: "/" }],
    logo: "/favicon.ico",

    sidebar: {
      "/": sidebars(),
    },
    search: {
      provider: "algolia",
      options: {
        appId: "4FKETO0A20",
        apiKey: "03223cde5bde720c013a7d28bb7c5cd4",
        indexName: "Binspire Docs",
      },
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/decimozs/binspire" },
    ],
  },
});
