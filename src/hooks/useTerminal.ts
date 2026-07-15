"use client";

import { useState, useCallback, useRef } from "react";

export interface TerminalLine {
  id: string;
  type: "input" | "output" | "error" | "system" | "success" | "info" | "ascii";
  content: string;
}

type CommandHandler = (args: string[]) => TerminalLine[];

interface CommandDefinition {
  handler: CommandHandler;
  description: string;
  usage: string;
  aliases?: string[];
}

const commands: Record<string, CommandDefinition> = {};

function registerCommand(name: string, def: CommandDefinition) {
  commands[name] = def;
  def.aliases?.forEach((alias) => {
    commands[alias] = def;
  });
}

// === HELP ===
registerCommand("help", {
  description: "Display available commands",
  usage: "help [command]",
  handler: (args) => {
    if (args[0] && commands[args[0]]) {
      const cmd = commands[args[0]];
      return [
        { id: crypto.randomUUID(), type: "system", content: `Command: ${args[0]}` },
        { id: crypto.randomUUID(), type: "output", content: `  ${cmd.description}` },
        { id: crypto.randomUUID(), type: "info", content: `  Usage: ${cmd.usage}` },
      ];
    }
    return [
      { id: crypto.randomUUID(), type: "system", content: "Available commands:" },
      { id: crypto.randomUUID(), type: "output", content: "" },
      { id: crypto.randomUUID(), type: "output", content: "  help [cmd]      Show this help or command details" },
      { id: crypto.randomUUID(), type: "output", content: "  whoami          Display info about me" },
      { id: crypto.randomUUID(), type: "output", content: "  about           About me" },
      { id: crypto.randomUUID(), type: "output", content: "  skills          List technical skills" },
      { id: crypto.randomUUID(), type: "output", content: "  projects        Show my projects" },
      { id: crypto.randomUUID(), type: "output", content: "  experience      Work experience" },
      { id: crypto.randomUUID(), type: "output", content: "  education       Educational background" },
      { id: crypto.randomUUID(), type: "output", content: "  contact         Contact information" },
      { id: crypto.randomUUID(), type: "output", content: "  certifications  Professional certifications" },
      { id: crypto.randomUUID(), type: "output", content: "  github          Fetch GitHub profile" },
      { id: crypto.randomUUID(), type: "output", content: "  joke            Random developer joke" },
      { id: crypto.randomUUID(), type: "output", content: "  neofetch        System information" },
      { id: crypto.randomUUID(), type: "output", content: "  clear           Clear the terminal" },
      { id: crypto.randomUUID(), type: "output", content: "  banner          Show welcome banner" },
      { id: crypto.randomUUID(), type: "output", content: "" },
      { id: crypto.randomUUID(), type: "info", content: "  Try 'sudo' for a surprise..." },
      { id: crypto.randomUUID(), type: "output", content: "" },
    ];
  },
});

// === WHOAMI ===
registerCommand("whoami", {
  description: "Display information about the site owner",
  usage: "whoami",
  handler: () => [
    { id: crypto.randomUUID(), type: "system", content: "=== VISITOR INFO ===" },
    { id: crypto.randomUUID(), type: "output", content: "" },
    { id: crypto.randomUUID(), type: "success", content: "  Aryan Bhalsing" },
    { id: crypto.randomUUID(), type: "output", content: "  Full-Stack Developer & AI Enthusiast" },
    { id: crypto.randomUUID(), type: "output", content: "  CS Student at MIT Academy of Engineering, Pune" },
    { id: crypto.randomUUID(), type: "output", content: "" },
    { id: crypto.randomUUID(), type: "info", content: "  Building secure systems through code & ethical hacking." },
    { id: crypto.randomUUID(), type: "output", content: "" },
  ],
});

// === ABOUT ===
registerCommand("about", {
  description: "About me - biography and interests",
  usage: "about",
  handler: () => [
    { id: crypto.randomUUID(), type: "system", content: "=== ABOUT ME ===" },
    { id: crypto.randomUUID(), type: "output", content: "" },
    { id: crypto.randomUUID(), type: "output", content: "I'm a passionate CS student who loves building" },
    { id: crypto.randomUUID(), type: "output", content: "things that live at the intersection of security," },
    { id: crypto.randomUUID(), type: "output", content: "AI, and full-stack development." },
    { id: crypto.randomUUID(), type: "output", content: "" },
    { id: crypto.randomUUID(), type: "output", content: "  > 30+ repositories on GitHub" },
    { id: crypto.randomUUID(), type: "output", content: "  > Developer Program Member" },
    { id: crypto.randomUUID(), type: "output", content: "  > Target: 365 Projects in 365 Days" },
    { id: crypto.randomUUID(), type: "output", content: "" },
    { id: crypto.randomUUID(), type: "info", content: "  Try 'skills' or 'projects' to learn more." },
    { id: crypto.randomUUID(), type: "output", content: "" },
  ],
});

// === SKILLS ===
registerCommand("skills", {
  description: "List technical skills and proficiency",
  usage: "skills [category]",
  handler: (args) => {
    const allSkills = {
      languages: {
        label: "Languages",
        items: [
          { name: "Python", level: "██████████░ 90%" },
          { name: "JavaScript", level: "███████░░░░ 75%" },
          { name: "C/C++", level: "██████░░░░░ 60%" },
          { name: "Java", level: "██████░░░░░ 55%" },
          { name: "HTML/CSS", level: "███████░░░░ 70%" },
          { name: "Shell Scripting", level: "█████░░░░░░ 50%" },
        ],
      },
      frameworks: {
        label: "Frameworks & Libraries",
        items: [
          { name: "React/Next.js", level: "███████░░░░ 65%" },
          { name: "Flask", level: "███████░░░░ 65%" },
          { name: "Node.js/Express", level: "██████░░░░░ 60%" },
          { name: "TensorFlow/Keras", level: "███████░░░░ 65%" },
          { name: "OpenCV/MediaPipe", level: "███████░░░░ 70%" },
          { name: "Spring Boot", level: "████░░░░░░░ 40%" },
        ],
      },
      security: {
        label: "Security & OSINT",
        items: [
          { name: "Cybersecurity", level: "███████░░░░ 75%" },
          { name: "OSINT", level: "██████░░░░░ 60%" },
          { name: "Port Scanning", level: "██████░░░░░ 60%" },
          { name: "Network Tools", level: "██████░░░░░ 55%" },
          { name: "Ethical Hacking", level: "██████░░░░░ 65%" },
        ],
      },
      tools: {
        label: "Tools & Platforms",
        items: [
          { name: "Git/GitHub", level: "████████░░░ 80%" },
          { name: "Docker", level: "█████░░░░░░ 45%" },
          { name: "AWS/Cloud", level: "█████░░░░░░ 45%" },
          { name: "Linux/Bash", level: "███████░░░░ 70%" },
          { name: "MongoDB", level: "██████░░░░░ 55%" },
          { name: "Firebase", level: "█████░░░░░░ 50%" },
        ],
      },
    };

    const category = args[0]?.toLowerCase();
    if (category && allSkills[category as keyof typeof allSkills]) {
      const cat = allSkills[category as keyof typeof allSkills];
      return [
        { id: crypto.randomUUID(), type: "system", content: `=== ${cat.label.toUpperCase()} ===` },
        { id: crypto.randomUUID(), type: "output", content: "" },
        ...cat.items.map((item) => ({
          id: crypto.randomUUID(),
          type: "output" as const,
          content: `  ${item.name.padEnd(20)} ${item.level}`,
        })),
        { id: crypto.randomUUID(), type: "output", content: "" },
      ];
    }

    return [
      { id: crypto.randomUUID(), type: "system", content: "=== TECHNICAL SKILLS ===" },
      { id: crypto.randomUUID(), type: "output", content: "" },
      { id: crypto.randomUUID(), type: "info", content: "Usage: skills [languages|frameworks|security|tools]" },
      { id: crypto.randomUUID(), type: "output", content: "" },
      ...Object.entries(allSkills).flatMap(([key, cat]) => [
        { id: crypto.randomUUID(), type: "output" as const, content: `  ${cat.label.toUpperCase()}` },
        ...cat.items.map((item) => ({
          id: crypto.randomUUID(),
          type: "output" as const,
          content: `    ${item.name.padEnd(18)} ${item.level}`,
        })),
        { id: crypto.randomUUID(), type: "output" as const, content: "" },
      ]),
    ];
  },
});

// === PROJECTS ===
registerCommand("projects", {
  description: "Show featured projects",
  usage: "projects [name]",
  handler: (args) => {
    const projects = [
      {
        name: "hand-gesture-virtual-mouse",
        desc: "Real-time hand gesture virtual mouse controlling laptop cursor via webcam",
        tech: "Python, MediaPipe, OpenCV, PyAutoGUI",
        stars: "16",
        url: "https://github.com/iamaryanbhalsing/Hand-Gesture-Virtual-Mouse",
      },
      {
        name: "blockchain-based-voting",
        desc: "UniVote - Decentralized voting platform on Ethereum Sepolia",
        tech: "Node.js, MongoDB, Web3.js, Solidity",
        stars: "5",
        url: "https://github.com/iamaryanbhalsing/blockchain-based-voting",
      },
      {
        name: "faq-chatbot",
        desc: "FAQ Chatbot with Flask, NLTK, and Cosine Similarity",
        tech: "Python, Flask, NLTK, Deployed on Render",
        stars: "6",
        url: "https://github.com/iamaryanbhalsing/faq-chatbot",
      },
      {
        name: "face-attendance-system",
        desc: "Privacy-first Face Recognition Attendance System",
        tech: "Python, OpenCV",
        stars: "6",
        url: "https://github.com/iamaryanbhalsing/face-attendance-system",
      },
      {
        name: "overloadx",
        desc: "DDoS attack script / network stresser tool (educational)",
        tech: "Python",
        stars: "6",
        url: "https://github.com/iamaryanbhalsing/OverLoadX",
      },
      {
        name: "downdetector",
        desc: "Real-time website uptime monitor with beautiful UI",
        tech: "HTML, Python",
        stars: "6",
        url: "https://github.com/iamaryanbhalsing/Downdetector",
      },
      {
        name: "github-info-api",
        desc: "GitHub Profile Scraper API (Cloudflare Worker, zero deps)",
        tech: "JavaScript, Cloudflare Workers",
        stars: "1",
        url: "https://github.com/iamaryanbhalsing/Github-Info-Api",
      },
    ];

    if (args[0]) {
      const project = projects.find((p) => p.name === args[0]);
      if (project) {
        return [
          { id: crypto.randomUUID(), type: "system", content: `=== ${project.name} ===` },
          { id: crypto.randomUUID(), type: "output", content: "" },
          { id: crypto.randomUUID(), type: "output", content: `  ${project.desc}` },
          { id: crypto.randomUUID(), type: "output", content: "" },
          { id: crypto.randomUUID(), type: "info", content: `  Tech:   ${project.tech}` },
          { id: crypto.randomUUID(), type: "info", content: `  Stars:  ${project.stars}` },
          { id: crypto.randomUUID(), type: "info", content: `  URL:    ${project.url}` },
        ];
      }
      return [{ id: crypto.randomUUID(), type: "error", content: `Project not found: ${args[0]}. Try 'projects' to list all.` }];
    }

    return [
      { id: crypto.randomUUID(), type: "system", content: "=== FEATURED PROJECTS ===" },
      { id: crypto.randomUUID(), type: "output", content: "" },
      ...projects.map((p) => ({
        id: crypto.randomUUID(),
        type: "output" as const,
        content: `  > ${p.name.padEnd(30)} ${p.stars}★`,
      })),
      { id: crypto.randomUUID(), type: "output", content: "" },
      { id: crypto.randomUUID(), type: "info", content: "  Usage: projects [name] for details" },
      { id: crypto.randomUUID(), type: "output", content: "" },
    ];
  },
});

// === EXPERIENCE ===
registerCommand("experience", {
  description: "Show work experience",
  usage: "experience",
  handler: () => [
    { id: crypto.randomUUID(), type: "system", content: "=== EXPERIENCE ===" },
    { id: crypto.randomUUID(), type: "output", content: "" },
    { id: crypto.randomUUID(), type: "info", content: "  Looking for internship opportunities" },
    { id: crypto.randomUUID(), type: "output", content: "  Actively seeking roles in:" },
    { id: crypto.randomUUID(), type: "output", content: "    - Full-Stack Development" },
    { id: crypto.randomUUID(), type: "output", content: "    - Cybersecurity / Ethical Hacking" },
    { id: crypto.randomUUID(), type: "output", content: "    - AI/ML Engineering" },
    { id: crypto.randomUUID(), type: "output", content: "" },
    { id: crypto.randomUUID(), type: "info", content: "  30+ personal projects demonstrate hands-on experience" },
    { id: crypto.randomUUID(), type: "output", content: "  across Python, JavaScript, AI/ML, and security tools." },
    { id: crypto.randomUUID(), type: "output", content: "" },
  ],
});

// === EDUCATION ===
registerCommand("education", {
  description: "Show educational background",
  usage: "education",
  handler: () => [
    { id: crypto.randomUUID(), type: "system", content: "=== EDUCATION ===" },
    { id: crypto.randomUUID(), type: "output", content: "" },
    { id: crypto.randomUUID(), type: "success", content: "  B.Tech Computer/IT Engineering" },
    { id: crypto.randomUUID(), type: "output", content: "  MIT Academy of Engineering, Alandi, Pune" },
    { id: crypto.randomUUID(), type: "output", content: "  2022 - Present" },
    { id: crypto.randomUUID(), type: "output", content: "" },
    { id: crypto.randomUUID(), type: "output", content: "  Focus Areas:" },
    { id: crypto.randomUUID(), type: "output", content: "    - AI & Machine Learning" },
    { id: crypto.randomUUID(), type: "output", content: "    - Cybersecurity" },
    { id: crypto.randomUUID(), type: "output", content: "    - Cloud Computing" },
    { id: crypto.randomUUID(), type: "output", content: "" },
  ],
});

// === CONTACT ===
registerCommand("contact", {
  description: "Show contact information",
  usage: "contact",
  handler: () => [
    { id: crypto.randomUUID(), type: "system", content: "=== CONTACT ===" },
    { id: crypto.randomUUID(), type: "output", content: "" },
    { id: crypto.randomUUID(), type: "output", content: "  Email:    aryanbhalsing7090@gmail.com" },
    { id: crypto.randomUUID(), type: "output", content: "  GitHub:   github.com/iamaryanbhalsing" },
    { id: crypto.randomUUID(), type: "output", content: "  LinkedIn: linkedin.com/in/iamaryanbhalsing" },
    { id: crypto.randomUUID(), type: "output", content: "  LeetCode: leetcode.com/iamaryanbhalsing" },
    { id: crypto.randomUUID(), type: "output", content: "  Website:  iamaryanbhalsing.netlify.app" },
    { id: crypto.randomUUID(), type: "output", content: "" },
    { id: crypto.randomUUID(), type: "success", content: "  Feel free to reach out! Open to internships." },
    { id: crypto.randomUUID(), type: "output", content: "" },
  ],
});

// === CERTIFICATIONS ===
registerCommand("certifications", {
  description: "Show professional certifications",
  usage: "certifications",
  handler: () => [
    { id: crypto.randomUUID(), type: "system", content: "=== CERTIFICATIONS ===" },
    { id: crypto.randomUUID(), type: "output", content: "" },
    { id: crypto.randomUUID(), type: "info", content: "  Coming soon! Check back later." },
    { id: crypto.randomUUID(), type: "output", content: "" },
  ],
});

// === NEOFETCH ===
registerCommand("neofetch", {
  description: "Display system information",
  usage: "neofetch",
  handler: () => [
    { id: crypto.randomUUID(), type: "ascii", content: `
    .---.        OS:      Portfolio OS v2.0
   /     \\       Host:    ${typeof window !== "undefined" ? window.location.hostname : "portfolio.dev"}
   \\.@-@./       Kernel:  React 19 + Next.js 16
   /\`\\_/\`\\       Shell:   /bin/portfolio
  //  _  \\\\      Editor:  VS Code + AI
  | \\( ) /|      CPU:     Creative Developer @ 3.8GHz
 /  /\`   \\'\\    Memory:  ∞ MB / ∞ MB
 \\__/\\___/       Uptime:  Since 2019` },
  ],
});

// === BANNER ===
registerCommand("banner", {
  description: "Show welcome banner",
  usage: "banner",
  handler: () => [
    { id: crypto.randomUUID(), type: "ascii", content: `
  ╔═══════════════════════════════════════════════╗
  ║                                               ║
  ║   ██████╗  █████╗ ██████╗ ██████╗             ║
  ║   ██╔══██╗██╔══██╗██╔══██╗██╔══██╗            ║
  ║   ██████╔╝███████║██████╔╝██████╔╝            ║
  ║   ██╔══██╗██╔══██║██╔═══╝ ██╔═══╝             ║
  ║   ██████╔╝██║  ██║██║     ██║                  ║
  ║   ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝                  ║
  ║                                               ║
  ║   Welcome to Aryan Bhalsing's Portfolio       ║
  ║   Type 'help' to get started                  ║
  ║                                               ║
  ╚═══════════════════════════════════════════════╝` },
  ],
});

// === SUDO ===
registerCommand("sudo", {
  description: "Attempt elevated privileges",
  usage: "sudo [command]",
  handler: (args) => {
    if (args.join(" ") === "rm" || args.join(" ").includes("rm -rf")) {
      return [
        { id: crypto.randomUUID(), type: "error", content: "Nice try! But this portfolio has root protection. ;)" },
        { id: crypto.randomUUID(), type: "ascii", content: `
  ╔══════════════════════════════════╗
  ║    ACCESS DENIED                 ║
  ║    Nice one though!              ║
  ╚══════════════════════════════════╝` },
      ];
    }
    return [
      { id: crypto.randomUUID(), type: "error", content: "visitor is not in the sudoers file. This incident will be reported." },
    ];
  },
});

// === GITHUB ===
registerCommand("github", {
  description: "Fetch GitHub profile info",
  usage: "github",
  handler: () => [
    { id: crypto.randomUUID(), type: "system", content: "=== GITHUB PROFILE ===" },
    { id: crypto.randomUUID(), type: "output", content: "" },
    { id: crypto.randomUUID(), type: "success", content: "  iamaryanbhalsing" },
    { id: crypto.randomUUID(), type: "output", content: "  Full-Stack Developer & AI Enthusiast" },
    { id: crypto.randomUUID(), type: "output", content: "  Repos: 30+ | Followers: growing" },
    { id: crypto.randomUUID(), type: "output", content: "  Developer Program Member" },
    { id: crypto.randomUUID(), type: "info", content: "  URL: https://github.com/iamaryanbhalsing" },
    { id: crypto.randomUUID(), type: "output", content: "" },
  ],
});

// === JOKE ===
registerCommand("joke", {
  description: "Random developer joke",
  usage: "joke",
  handler: () => {
    const jokes = [
      "Why do programmers prefer dark mode? Because light attracts bugs.",
      "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
      "Why was the JavaScript developer sad? Because he didn't Node how to Express himself.",
      "What's a programmer's favorite hangout place? Foo Bar.",
      "Why do Java developers wear glasses? Because they can't C#.",
      "How many programmers does it take to change a light bulb? None — that's a hardware problem.",
      "What is a robot's favorite type of music? Heavy metal.",
      "Why do programmers hate nature? It has too many bugs.",
    ];
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    return [
      { id: crypto.randomUUID(), type: "info", content: joke },
    ];
  },
});

// === CLEAR (special — handled externally) ===
registerCommand("clear", {
  description: "Clear the terminal screen",
  usage: "clear",
  handler: () => [],
});

function parseInput(input: string): string[] {
  const tokens: string[] = [];
  let current = "";
  for (const char of input) {
    if (char === " ") {
      if (current) {
        tokens.push(current);
        current = "";
      }
    } else {
      current += char;
    }
  }
  if (current) tokens.push(current);
  return tokens;
}

export function useTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const addLines = useCallback((newLines: TerminalLine[]) => {
    setLines((prev) => [...prev, ...newLines]);
  }, []);

  const clearLines = useCallback(() => {
    setLines([]);
  }, []);

  const processCommand = useCallback(
    (rawInput: string) => {
      const trimmed = rawInput.trim();
      if (!trimmed) return;

      const inputLine: TerminalLine = {
        id: crypto.randomUUID(),
        type: "input",
        content: trimmed,
      };

      setLines((prev) => [...prev, inputLine]);
      setHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);

      const tokens = parseInput(trimmed);
      const command = tokens[0]?.toLowerCase();
      const args = tokens.slice(1);

      if (command === "clear") {
        clearLines();
        return;
      }

      if (command && commands[command]) {
        const output = commands[command].handler(args);
        if (output) {
          setLines((prev) => [...prev, ...output]);
        }
      } else if (command) {
        setLines((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            type: "error",
            content: `portfolio: command not found: ${command}. Type 'help' for available commands.`,
          },
        ]);
      }
    },
    [clearLines]
  );

  const navigateHistory = useCallback(
    (direction: "up" | "down") => {
      setHistoryIndex((prev) => {
        if (direction === "up") {
          return Math.min(prev + 1, history.length - 1);
        }
        return Math.max(prev - 1, -1);
      });
    },
    [history.length]
  );

  const currentHistoryCommand = historyIndex >= 0 ? history[history.length - 1 - historyIndex] : "";

  return {
    lines,
    processCommand,
    clearLines,
    navigateHistory,
    currentHistoryCommand,
    inputRef,
  };
}
