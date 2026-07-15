export interface SkillCategory {
  title: string;
  icon: string;
  skills: { name: string; icon: string; proficiency: number }[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: "Languages",
    icon: "code",
    skills: [
      { name: "Python", icon: "code", proficiency: 90 },
      { name: "JavaScript (ES6+)", icon: "code", proficiency: 75 },
      { name: "C/C++", icon: "code", proficiency: 60 },
      { name: "Java", icon: "code", proficiency: 55 },
      { name: "HTML/CSS", icon: "code", proficiency: 70 },
      { name: "Shell Scripting", icon: "terminal", proficiency: 50 },
    ],
  },
  {
    title: "Frameworks & Libraries",
    icon: "layers",
    skills: [
      { name: "React / Next.js", icon: "react", proficiency: 65 },
      { name: "Flask", icon: "code", proficiency: 65 },
      { name: "Node.js / Express", icon: "node", proficiency: 60 },
      { name: "TensorFlow / Keras", icon: "brain", proficiency: 65 },
      { name: "OpenCV / MediaPipe", icon: "eye", proficiency: 70 },
      { name: "Spring Boot", icon: "leaf", proficiency: 40 },
    ],
  },
  {
    title: "Security & OSINT",
    icon: "shield",
    skills: [
      { name: "Cybersecurity", icon: "shield", proficiency: 75 },
      { name: "Ethical Hacking", icon: "terminal", proficiency: 65 },
      { name: "OSINT", icon: "search", proficiency: 60 },
      { name: "Network Tools", icon: "wifi", proficiency: 55 },
    ],
  },
  {
    title: "Tools & Platforms",
    icon: "settings",
    skills: [
      { name: "Git / GitHub", icon: "git", proficiency: 80 },
      { name: "Docker", icon: "docker", proficiency: 45 },
      { name: "AWS / Cloud", icon: "cloud", proficiency: 45 },
      { name: "Linux / Bash", icon: "terminal", proficiency: 70 },
      { name: "MongoDB", icon: "database", proficiency: 55 },
      { name: "Firebase", icon: "database", proficiency: 50 },
    ],
  },
];
