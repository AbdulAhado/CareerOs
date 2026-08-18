export type TemplateId =
  | "executive"
  | "modern"
  | "minimal"
  | "ats"
  | "professional"
  | "tech"
  | "academic"
  | "creative"

export type FontStyle = "sans" | "serif" | "clean" | "tech" | "mono"
export type SpacingLevel = "compact" | "normal" | "spacious"
export type MarginLevel = "compact" | "normal" | "wide"

export interface PersonalInfo {
  fullName: string
  jobTitle: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  portfolio: string
  website: string
  photoUrl?: string
}

export interface ExperienceItem {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  currentlyWorking: boolean
  description: string
}

export interface EducationItem {
  id: string
  degree: string
  institution: string
  location: string
  startDate: string
  endDate: string
  description: string
}

export interface SkillItem {
  id: string
  name: string
  category: string
}

export interface ProjectItem {
  id: string
  name: string
  description: string
  technologies: string
  projectUrl: string
  githubUrl: string
}

export interface CertificationItem {
  id: string
  name: string
  organization: string
  date: string
  credentialUrl: string
}

export interface LanguageItem {
  id: string
  language: string
  proficiency: string
}

export interface AwardItem {
  id: string
  name: string
  organization: string
  date: string
  description: string
}

export interface CustomSectionItem {
  id: string
  title: string
  content: string
}

export type SectionKey =
  | "summary"
  | "experience"
  | "projects"
  | "skills"
  | "education"
  | "certifications"
  | "languages"
  | "awards"
  | "custom"

export interface ResumeData {
  title: string
  personal: PersonalInfo
  summary: string
  experience: ExperienceItem[]
  education: EducationItem[]
  skills: SkillItem[]
  projects: ProjectItem[]
  certifications: CertificationItem[]
  languages: LanguageItem[]
  awards: AwardItem[]
  customSections: CustomSectionItem[]
  sectionOrder: SectionKey[]
  sectionVisibility: Record<SectionKey, boolean>
}

export interface CustomizationSettings {
  templateId: TemplateId
  accentColor: string
  fontStyle: FontStyle
  spacing: SpacingLevel
  margins: MarginLevel
}
