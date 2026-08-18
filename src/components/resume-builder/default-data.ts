import { ResumeData, CustomizationSettings } from "./types"

export const DEFAULT_RESUME_DATA: ResumeData = {
  title: "Senior Full Stack Engineer Resume",
  personal: {
    fullName: "Abdul Ahad Saeed",
    jobTitle: "Senior Full Stack Engineer",
    email: "ahadrana0125@gmail.com",
    phone: "+92 305 695 3657",
    location: "Multan, Pakistan",
    linkedin: "linkedin.com/in/ahad-saeed",
    github: "github.com/ahadrana",
    portfolio: "ahad-mern-stack.netlify.app",
    website: "https://careeros.app",
    photoUrl: "",
  },
  summary:
    "Results-driven Full Stack Engineer with 3+ years of experience building high-performance web applications using React, Next.js, Node.js, and MongoDB. Proven track record of scaling frontend architectures, integrating AI pipelines, and reducing API response latencies by 35%. Passionate about clean code, developer tooling, and automated workflows.",
  experience: [
    {
      id: "exp-1",
      title: "Senior Full Stack Developer",
      company: "TechMatrix Labs",
      location: "Lahore, Pakistan",
      startDate: "Jan 2024",
      endDate: "Present",
      currentlyWorking: true,
      description:
        "• Architected microservices and RESTful APIs serving 50,000+ daily active users with 99.9% uptime.\n• Spearheaded Next.js 15 migration, improving Core Web Vitals and SEO performance by 40%.\n• Integrated OpenRouter AI pipeline for automated candidate resume scoring and skill matching.",
    },
    {
      id: "exp-2",
      title: "Frontend Developer",
      company: "WebStudio Inc.",
      location: "Remote",
      startDate: "Jun 2022",
      endDate: "Dec 2023",
      currentlyWorking: false,
      description:
        "• Developed 15+ responsive React web apps using Tailwind CSS and TypeScript.\n• Implemented secure NextAuth authentication flows and Stripe payment integrations.\n• Reduced bundle size by 30% through code-splitting and dynamic component imports.",
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "BS in Information Technology",
      institution: "Bahauddin Zakariya University (BZU)",
      location: "Multan, Pakistan",
      startDate: "2024",
      endDate: "2028",
      description: "Focused on Data Structures, Algorithms, Web Architecture, and Software Engineering Principles.",
    },
  ],
  skills: [
    { id: "s-1", name: "JavaScript / TypeScript", category: "Frontend" },
    { id: "s-2", name: "React.js / Next.js", category: "Frontend" },
    { id: "s-3", name: "Tailwind CSS / HTML5", category: "Frontend" },
    { id: "s-4", name: "Node.js / Express", category: "Backend" },
    { id: "s-5", name: "MongoDB / Mongoose", category: "Database" },
    { id: "s-6", name: "PostgreSQL / Prisma", category: "Database" },
    { id: "s-7", name: "Git / GitHub Actions", category: "Tools" },
    { id: "s-8", name: "REST APIs & OpenRouter AI", category: "Tools" },
  ],
  projects: [
    {
      id: "proj-1",
      name: "CareerOS — AI Career Suite",
      technologies: "Next.js 15, TypeScript, Tailwind CSS, OpenRouter AI",
      projectUrl: "https://careeros.app",
      githubUrl: "https://github.com/ahadrana/careeros",
      description:
        "Engineered an enterprise AI platform featuring real-time ATS resume analyzer, PDF/DOCX parser, interactive interview coach, and multi-template resume builder.",
    },
    {
      id: "proj-2",
      name: "VideoTube — Video Platform",
      technologies: "React, Node.js, Express, MongoDB, Cloudinary",
      projectUrl: "https://videotube-demo.netlify.app",
      githubUrl: "https://github.com/ahadrana/videotube",
      description:
        "Built a full-stack YouTube clone supporting video uploads, streaming, comment threads, and user channels.",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "Full Stack Web Development",
      organization: "Meta / Coursera",
      date: "2023",
      credentialUrl: "https://coursera.org/verify/meta-fullstack",
    },
  ],
  languages: [
    { id: "lang-1", language: "English", proficiency: "Professional Working" },
    { id: "lang-2", language: "Urdu", proficiency: "Native / Bilingual" },
  ],
  awards: [
    {
      id: "award-1",
      name: "Best University Capstone Project",
      organization: "BZU IT Department",
      date: "2024",
      description: "Awarded 1st place for AI-powered web accessibility tool.",
    },
  ],
  customSections: [],
  sectionOrder: [
    "summary",
    "experience",
    "projects",
    "skills",
    "education",
    "certifications",
    "languages",
    "awards",
    "custom",
  ],
  sectionVisibility: {
    summary: true,
    experience: true,
    projects: true,
    skills: true,
    education: true,
    certifications: true,
    languages: true,
    awards: true,
    custom: true,
  },
}

export const DEFAULT_CUSTOMIZATION: CustomizationSettings = {
  templateId: "executive",
  accentColor: "#dc2626", // Red primary accent
  fontStyle: "sans",
  spacing: "normal",
  margins: "normal",
}
