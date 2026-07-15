export type ProjectCategory = "ai" | "security" | "fullstack" | "cloud";

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  tags: { label: string; icon: string }[];
  highlight: string;
  links: {
    live?: string;
    github?: string;
  };
  flagship?: boolean;
  category: ProjectCategory;
}

export const PROJECT_CATEGORIES: { key: ProjectCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "ai", label: "AI / ML" },
  { key: "security", label: "Security" },
  { key: "fullstack", label: "Full-Stack" },
  { key: "cloud", label: "Cloud" },
];

export const projects: Project[] = [
  {
    id: "hand-gesture-virtual-mouse",
    title: "Hand Gesture Virtual Mouse",
    description:
      "Real-time hand gesture virtual mouse controlling laptop cursor via webcam hand tracking using MediaPipe and OpenCV.",
    longDescription:
      "Built a system that uses computer vision to track hand landmarks via webcam and translates gestures into mouse movements and clicks. Uses MediaPipe for hand detection, OpenCV for image processing, and PyAutoGUI for cursor control.",
    image: "https://iili.io/BJ9g9Fj.jpg",
    tags: [
      { label: "Python", icon: "code" },
      { label: "MediaPipe", icon: "brain" },
      { label: "OpenCV", icon: "eye" },
      { label: "PyAutoGUI", icon: "cursor" },
    ],
    highlight: "16 GitHub stars — Most popular project",
    links: {
      github: "https://github.com/iamaryanbhalsing/Hand-Gesture-Virtual-Mouse",
    },
    flagship: true,
    category: "ai",
  },
  {
    id: "blockchain-based-voting",
    title: "UniVote — Blockchain Voting",
    description:
      "Decentralized voting platform on Ethereum Sepolia with smart contracts, role-based auth, and real-time results.",
    longDescription:
      "A full-stack decentralized application featuring Ethereum smart contracts for vote recording, Node.js backend for API logic, MongoDB for user data, and a responsive frontend. Implements JWT auth, admin controls, and ballot integrity via blockchain.",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=80",
    tags: [
      { label: "Node.js", icon: "node" },
      { label: "MongoDB", icon: "database" },
      { label: "Web3.js", icon: "chain" },
      { label: "Solidity", icon: "code" },
    ],
    highlight: "5 GitHub stars — Smart contract integration",
    links: {
      github: "https://github.com/iamaryanbhalsing/blockchain-based-voting",
    },
    flagship: false,
    category: "fullstack",
  },
  {
    id: "faq-chatbot",
    title: "FAQ Chatbot",
    description:
      "NLP-powered FAQ chatbot using Flask, NLTK, and cosine similarity. Deployed on Render with a clean web interface.",
    longDescription:
      "A conversational agent that parses user questions, tokenizes them with NLTK, computes TF-IDF vectors, and returns the most similar FAQ answer using cosine similarity. Built with Flask backend and deployed on Render.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
    tags: [
      { label: "Python", icon: "code" },
      { label: "Flask", icon: "leaf" },
      { label: "NLTK", icon: "brain" },
      { label: "NLP", icon: "text" },
    ],
    highlight: "6 GitHub stars — Deployed on Render",
    links: {
      live: "https://faq-chatbot.onrender.com",
      github: "https://github.com/iamaryanbhalsing/faq-chatbot",
    },
    flagship: false,
    category: "ai",
  },
  {
    id: "downdetector",
    title: "Downdetector",
    description:
      "Real-time website uptime monitor with a beautiful dashboard. Checks site status at intervals and alerts on downtime.",
    longDescription:
      "A monitoring tool that periodically checks website availability and displays status history with a clean UI. Tracks response codes, latency, and uptime percentage over time.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
    tags: [
      { label: "HTML", icon: "code" },
      { label: "Python", icon: "code" },
      { label: "Dashboard", icon: "chart" },
    ],
    highlight: "6 GitHub stars — Clean monitoring UI",
    links: {
      github: "https://github.com/iamaryanbhalsing/Downdetector",
    },
    flagship: false,
    category: "fullstack",
  },
  {
    id: "face-attendance",
    title: "Face Attendance System",
    description:
      "Privacy-first face recognition attendance system using OpenCV. Records presence without storing biometric data.",
    longDescription:
      "An attendance system that uses face detection and recognition to mark presence. Designed with privacy in mind — no biometric data is stored permanently. Uses OpenCV's Haar cascades for detection.",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=900&q=80",
    tags: [
      { label: "Python", icon: "code" },
      { label: "OpenCV", icon: "eye" },
      { label: "Computer Vision", icon: "brain" },
    ],
    highlight: "6 GitHub stars — Privacy-first design",
    links: {
      github: "https://github.com/iamaryanbhalsing/face-attendance-system",
    },
    flagship: false,
    category: "ai",
  },
  {
    id: "github-info-api",
    title: "GitHub Info API",
    description:
      "GitHub profile scraper API built as a Cloudflare Worker with zero external dependencies. Fast, serverless, free.",
    longDescription:
      "A lightweight API that scrapes GitHub profile data and returns it as JSON. Built on Cloudflare Workers for edge deployment with zero dependencies, making it extremely fast and free to operate.",
    image:
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=900&q=80",
    tags: [
      { label: "JavaScript", icon: "code" },
      { label: "Cloudflare Workers", icon: "cloud" },
      { label: "API", icon: "server" },
    ],
    highlight: "Zero dependencies — Edge-deployed",
    links: {
      github: "https://github.com/iamaryanbhalsing/Github-Info-Api",
    },
    flagship: false,
    category: "cloud",
  },
];
