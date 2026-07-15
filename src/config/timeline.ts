export interface TimelineEntry {
  role: string;
  company: string;
  period: string;
  description?: string;
  highlights: string[];
  tags?: string[];
  current?: boolean;
}

export const education: TimelineEntry[] = [
  {
    role: "B.Tech · Computer / IT Engineering",
    company: "MIT Academy of Engineering, Pune",
    period: "2022 – Present",
    description: "Specialized coursework in:",
    highlights: [
      "Built multiple course projects from requirements gathering to deployment.",
      "Collaborated in teams using Git and agile workflows.",
    ],
    tags: ["Artificial Intelligence", "Cybersecurity", "Cloud Computing"],
    current: true,
  },
];

export const experience: TimelineEntry[] = [
  {
    role: "Backend / Full-Stack Intern",
    company: "Company Name / Freelance",
    period: "Month 20xx – Month 20xx",
    highlights: [
      "Designed REST APIs and database schemas for internal tools.",
      "Optimized SQL queries, reducing database latency in key endpoints.",
      "Implemented authentication and role-based access for admin dashboards.",
    ],
  },
];
