export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
  icon: string;
}

export const certifications: Certification[] = [
  {
    id: "ibm-ai",
    name: "Introduction to Artificial Intelligence",
    issuer: "IBM",
    date: "2024",
    url: "https://www.coursera.org/account/accomplishments/verify/EXAMPLE",
    icon: "brain",
  },
  {
    id: "ibm-data-science",
    name: "Data Science Fundamentals",
    issuer: "IBM",
    date: "2024",
    url: "https://www.coursera.org/account/accomplishments/verify/EXAMPLE",
    icon: "chart",
  },
  {
    id: "google-cybersecurity",
    name: "Google Cybersecurity Certificate",
    issuer: "Google",
    date: "2024",
    url: "https://www.coursera.org/account/accomplishments/verify/EXAMPLE",
    icon: "shield",
  },
  {
    id: "linux-essentials",
    name: "Linux Essentials",
    issuer: "Linux Professional Institute",
    date: "2023",
    icon: "terminal",
  },
];
