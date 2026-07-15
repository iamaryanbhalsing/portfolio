export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  avatar?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Prof. Priya Sharma",
    role: "AI/ML Course Instructor",
    company: "MITAOE",
    text: "Aryan consistently demonstrates strong problem-solving skills and a deep understanding of AI concepts. His projects show both technical depth and creative thinking.",
  },
  {
    id: "2",
    name: "Rahul Verma",
    role: "Project Collaborator",
    company: "MITAOE",
    text: "Working with Aryan on the blockchain voting project was a great experience. He brings reliability, clean code, and a proactive attitude to every team project.",
  },
  {
    id: "3",
    name: "Sneha Patil",
    role: "Hackathon Teammate",
    company: "Smart India Hackathon",
    text: "Aryan's ability to quickly prototype ideas and deliver working demos under pressure is impressive. He's the kind of developer every team needs.",
  },
];
