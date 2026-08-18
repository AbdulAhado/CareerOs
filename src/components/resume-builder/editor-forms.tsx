import React, { useState } from "react"
import { ResumeData, SectionKey } from "./types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Globe,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

interface EditorFormsProps {
  data: ResumeData
  onChange: (data: ResumeData) => void
  onAIOperation: (action: string, contextText: string, targetKey: string, itemId?: string) => Promise<void>
  aiLoadingKey: string | null
}

export function EditorForms({ data, onChange, onAIOperation, aiLoadingKey }: EditorFormsProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    personal: true,
    summary: true,
    experience: true,
    projects: false,
    skills: false,
    education: false,
    certifications: false,
    languages: false,
    reorder: false,
  })

  const toggleSection = (sec: string) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }))
  }

  // Update Personal Info helper
  const updatePersonal = (field: string, val: string) => {
    onChange({
      ...data,
      personal: {
        ...data.personal,
        [field]: val,
      },
    })
  }

  // Update Summary helper
  const updateSummary = (val: string) => {
    onChange({ ...data, summary: val })
  }

  // Section Visibility Toggle
  const toggleVisibility = (secKey: SectionKey) => {
    onChange({
      ...data,
      sectionVisibility: {
        ...data.sectionVisibility,
        [secKey]: !data.sectionVisibility[secKey],
      },
    })
  }

  // Move Section Up/Down
  const moveSection = (idx: number, direction: "up" | "down") => {
    const newOrder = [...data.sectionOrder]
    const targetIdx = direction === "up" ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= newOrder.length) return
    const temp = newOrder[idx]
    newOrder[idx] = newOrder[targetIdx]
    newOrder[targetIdx] = temp
    onChange({ ...data, sectionOrder: newOrder })
  }

  /* ── 1. Experience Handlers ── */
  const addExperience = () => {
    const newItem = {
      id: `exp-${Date.now()}`,
      title: "Software Engineer",
      company: "Company Name",
      location: "City, Country",
      startDate: "Jan 2024",
      endDate: "Present",
      currentlyWorking: true,
      description: "• Developed core features and improved team workflows.\n• Collaborated with cross-functional teams.",
    }
    onChange({ ...data, experience: [...data.experience, newItem] })
  }

  const updateExperience = (id: string, field: string, val: any) => {
    onChange({
      ...data,
      experience: data.experience.map((item) => (item.id === id ? { ...item, [field]: val } : item)),
    })
  }

  const duplicateExperience = (id: string) => {
    const item = data.experience.find((i) => i.id === id)
    if (!item) return
    const dup = { ...item, id: `exp-${Date.now()}` }
    onChange({ ...data, experience: [...data.experience, dup] })
  }

  const deleteExperience = (id: string) => {
    onChange({ ...data, experience: data.experience.filter((i) => i.id !== id) })
  }

  /* ── 2. Education Handlers ── */
  const addEducation = () => {
    const newItem = {
      id: `edu-${Date.now()}`,
      degree: "BS in Computer Science",
      institution: "University Name",
      location: "City, Country",
      startDate: "2020",
      endDate: "2024",
      description: "",
    }
    onChange({ ...data, education: [...data.education, newItem] })
  }

  const updateEducation = (id: string, field: string, val: string) => {
    onChange({
      ...data,
      education: data.education.map((item) => (item.id === id ? { ...item, [field]: val } : item)),
    })
  }

  const deleteEducation = (id: string) => {
    onChange({ ...data, education: data.education.filter((i) => i.id !== id) })
  }

  /* ── 3. Skills Handlers ── */
  const addSkill = () => {
    const newItem = { id: `skill-${Date.now()}`, name: "New Skill", category: "Technical" }
    onChange({ ...data, skills: [...data.skills, newItem] })
  }

  const updateSkill = (id: string, name: string) => {
    onChange({
      ...data,
      skills: data.skills.map((s) => (s.id === id ? { ...s, name } : s)),
    })
  }

  const deleteSkill = (id: string) => {
    onChange({ ...data, skills: data.skills.filter((s) => s.id !== id) })
  }

  /* ── 4. Projects Handlers ── */
  const addProject = () => {
    const newItem = {
      id: `proj-${Date.now()}`,
      name: "Project Name",
      description: "Brief project description...",
      technologies: "React, Node.js",
      projectUrl: "",
      githubUrl: "",
    }
    onChange({ ...data, projects: [...data.projects, newItem] })
  }

  const updateProject = (id: string, field: string, val: string) => {
    onChange({
      ...data,
      projects: data.projects.map((p) => (p.id === id ? { ...p, [field]: val } : p)),
    })
  }

  const deleteProject = (id: string) => {
    onChange({ ...data, projects: data.projects.filter((p) => p.id !== id) })
  }

  /* ── 5. Certifications Handlers ── */
  const addCertification = () => {
    const newItem = {
      id: `cert-${Date.now()}`,
      name: "AWS Certified Developer",
      organization: "Amazon Web Services",
      date: "2024",
      credentialUrl: "",
    }
    onChange({ ...data, certifications: [...data.certifications, newItem] })
  }

  const updateCertification = (id: string, field: string, val: string) => {
    onChange({
      ...data,
      certifications: data.certifications.map((c) => (c.id === id ? { ...c, [field]: val } : c)),
    })
  }

  const deleteCertification = (id: string) => {
    onChange({ ...data, certifications: data.certifications.filter((c) => c.id !== id) })
  }

  /* ── 6. Languages Handlers ── */
  const addLanguage = () => {
    const newItem = { id: `lang-${Date.now()}`, language: "English", proficiency: "Professional" }
    onChange({ ...data, languages: [...data.languages, newItem] })
  }

  const updateLanguage = (id: string, field: string, val: string) => {
    onChange({
      ...data,
      languages: data.languages.map((l) => (l.id === id ? { ...l, [field]: val } : l)),
    })
  }

  const deleteLanguage = (id: string) => {
    onChange({ ...data, languages: data.languages.filter((l) => l.id !== id) })
  }

  return (
    <div className="space-y-3">
      {/* 1. Personal Info */}
      <div className="border border-border/60 rounded-xl bg-card overflow-hidden">
        <button
          onClick={() => toggleSection("personal")}
          className="w-full flex items-center justify-between p-4 font-semibold text-sm hover:bg-muted/30 transition-colors text-left"
        >
          <div className="flex items-center gap-2 text-primary">
            <User className="h-4 w-4" /> Personal Information
          </div>
          {openSections.personal ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </button>
        {openSections.personal && (
          <div className="p-4 pt-0 border-t border-border/40 space-y-3 mt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground/80 block mb-1">Full Name</label>
                <Input value={data.personal.fullName} onChange={(e) => updatePersonal("fullName", e.target.value)} placeholder="e.g. John Smith" className="h-9 text-xs" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground/80 block mb-1">Job Title</label>
                <Input value={data.personal.jobTitle} onChange={(e) => updatePersonal("jobTitle", e.target.value)} placeholder="e.g. Senior Software Engineer" className="h-9 text-xs" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground/80 block mb-1">Email Address</label>
                <Input value={data.personal.email} onChange={(e) => updatePersonal("email", e.target.value)} placeholder="e.g. john@example.com" className="h-9 text-xs" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground/80 block mb-1">Phone Number</label>
                <Input value={data.personal.phone} onChange={(e) => updatePersonal("phone", e.target.value)} placeholder="e.g. +1 (555) 019-2831" className="h-9 text-xs" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground/80 block mb-1">Location</label>
                <Input value={data.personal.location} onChange={(e) => updatePersonal("location", e.target.value)} placeholder="e.g. New York, NY" className="h-9 text-xs" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground/80 block mb-1">LinkedIn Profile</label>
                <Input value={data.personal.linkedin} onChange={(e) => updatePersonal("linkedin", e.target.value)} placeholder="linkedin.com/in/username" className="h-9 text-xs" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground/80 block mb-1">GitHub Profile</label>
                <Input value={data.personal.github} onChange={(e) => updatePersonal("github", e.target.value)} placeholder="github.com/username" className="h-9 text-xs" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground/80 block mb-1">Portfolio / Website</label>
                <Input value={data.personal.portfolio} onChange={(e) => updatePersonal("portfolio", e.target.value)} placeholder="yourportfolio.com" className="h-9 text-xs" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Professional Summary */}
      <div className="border border-border/60 rounded-xl bg-card overflow-hidden">
        <button
          onClick={() => toggleSection("summary")}
          className="w-full flex items-center justify-between p-4 font-semibold text-sm hover:bg-muted/30 transition-colors text-left"
        >
          <div className="flex items-center gap-2 text-primary">
            <FileText className="h-4 w-4" /> Professional Summary
          </div>
          {openSections.summary ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </button>
        {openSections.summary && (
          <div className="p-4 pt-0 border-t border-border/40 space-y-3 mt-1">
            <Textarea
              value={data.summary}
              onChange={(e) => updateSummary(e.target.value)}
              placeholder="Write a concise professional summary..."
              className="h-28 text-xs resize-none leading-relaxed"
            />
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> AI Assist:
              </span>
              {["Improve", "Make Professional", "Make Concise", "Make Impactful"].map((action) => (
                <Button
                  key={action}
                  variant="outline"
                  size="sm"
                  className="h-7 text-[11px] border-primary/30 hover:bg-primary/10 text-primary cursor-pointer"
                  onClick={() => onAIOperation(action, data.summary, "summary")}
                  disabled={aiLoadingKey === `summary-${action}`}
                >
                  {aiLoadingKey === `summary-${action}` ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : null}
                  {action}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Experience */}
      <div className="border border-border/60 rounded-xl bg-card overflow-hidden">
        <button
          onClick={() => toggleSection("experience")}
          className="w-full flex items-center justify-between p-4 font-semibold text-sm hover:bg-muted/30 transition-colors text-left"
        >
          <div className="flex items-center gap-2 text-primary">
            <Briefcase className="h-4 w-4" /> Work Experience ({data.experience.length})
          </div>
          {openSections.experience ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </button>
        {openSections.experience && (
          <div className="p-4 pt-0 border-t border-border/40 space-y-4 mt-1">
            {data.experience.map((exp, idx) => (
              <div key={exp.id} className="p-3 border border-border/50 rounded-lg bg-muted/20 space-y-3">
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="text-xs font-bold text-foreground">Position #{idx + 1}</span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => duplicateExperience(exp.id)} title="Duplicate">
                      <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => deleteExperience(exp.id)} title="Delete">
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium block mb-1">Job Title</label>
                    <Input value={exp.title} onChange={(e) => updateExperience(exp.id, "title", e.target.value)} className="h-8 text-xs" />
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1">Company Name</label>
                    <Input value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} className="h-8 text-xs" />
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1">Location</label>
                    <Input value={exp.location} onChange={(e) => updateExperience(exp.id, "location", e.target.value)} className="h-8 text-xs" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium block mb-1">Start Date</label>
                      <Input value={exp.startDate} onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)} className="h-8 text-xs" />
                    </div>
                    <div>
                      <label className="text-xs font-medium block mb-1">End Date</label>
                      <Input value={exp.currentlyWorking ? "Present" : exp.endDate} disabled={exp.currentlyWorking} onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)} className="h-8 text-xs" />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium">Description / Bullet Points</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-[10px] text-primary hover:bg-primary/10 font-medium"
                      onClick={() => onAIOperation("Make Impactful", exp.description, "experience", exp.id)}
                      disabled={aiLoadingKey === `exp-${exp.id}`}
                    >
                      {aiLoadingKey === `exp-${exp.id}` ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <Sparkles className="h-3 w-3 mr-1" />}
                      ✨ Polish Bullets with AI
                    </Button>
                  </div>
                  <Textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                    placeholder="• Bullet 1 with quantified result...\n• Bullet 2..."
                    className="h-24 text-xs font-mono resize-none leading-relaxed"
                  />
                </div>
              </div>
            ))}
            <Button onClick={addExperience} variant="outline" size="sm" className="w-full border-dashed border-primary/40 text-primary hover:bg-primary/10 cursor-pointer">
              <Plus className="h-4 w-4 mr-1" /> Add Position
            </Button>
          </div>
        )}
      </div>

      {/* 4. Projects */}
      <div className="border border-border/60 rounded-xl bg-card overflow-hidden">
        <button
          onClick={() => toggleSection("projects")}
          className="w-full flex items-center justify-between p-4 font-semibold text-sm hover:bg-muted/30 transition-colors text-left"
        >
          <div className="flex items-center gap-2 text-primary">
            <FolderGit2 className="h-4 w-4" /> Projects ({data.projects.length})
          </div>
          {openSections.projects ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </button>
        {openSections.projects && (
          <div className="p-4 pt-0 border-t border-border/40 space-y-4 mt-1">
            {data.projects.map((proj, idx) => (
              <div key={proj.id} className="p-3 border border-border/50 rounded-lg bg-muted/20 space-y-3">
                <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                  <span className="text-xs font-bold">Project #{idx + 1}</span>
                  <Button variant="ghost" size="icon-sm" onClick={() => deleteProject(proj.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium block mb-1">Project Name</label>
                    <Input value={proj.name} onChange={(e) => updateProject(proj.id, "name", e.target.value)} className="h-8 text-xs" />
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1">Tech Stack</label>
                    <Input value={proj.technologies} onChange={(e) => updateProject(proj.id, "technologies", e.target.value)} className="h-8 text-xs" placeholder="e.g. React, Node.js" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Description</label>
                  <Textarea value={proj.description} onChange={(e) => updateProject(proj.id, "description", e.target.value)} className="h-16 text-xs resize-none" />
                </div>
              </div>
            ))}
            <Button onClick={addProject} variant="outline" size="sm" className="w-full border-dashed border-primary/40 text-primary hover:bg-primary/10 cursor-pointer">
              <Plus className="h-4 w-4 mr-1" /> Add Project
            </Button>
          </div>
        )}
      </div>

      {/* 5. Skills */}
      <div className="border border-border/60 rounded-xl bg-card overflow-hidden">
        <button
          onClick={() => toggleSection("skills")}
          className="w-full flex items-center justify-between p-4 font-semibold text-sm hover:bg-muted/30 transition-colors text-left"
        >
          <div className="flex items-center gap-2 text-primary">
            <Wrench className="h-4 w-4" /> Skills &amp; Competencies ({data.skills.length})
          </div>
          {openSections.skills ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </button>
        {openSections.skills && (
          <div className="p-4 pt-0 border-t border-border/40 space-y-3 mt-1">
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-1.5 p-1.5 pl-2.5 rounded-lg border border-border/60 bg-muted/30">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, e.target.value)}
                    className="bg-transparent text-xs font-semibold focus:outline-none w-28 text-foreground"
                  />
                  <Button variant="ghost" size="icon-sm" className="h-5 w-5 p-0" onClick={() => deleteSkill(skill.id)}>
                    <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
            <Button onClick={addSkill} variant="outline" size="sm" className="w-full border-dashed border-primary/40 text-primary hover:bg-primary/10 cursor-pointer">
              <Plus className="h-4 w-4 mr-1" /> Add Skill Tag
            </Button>
          </div>
        )}
      </div>

      {/* 6. Education */}
      <div className="border border-border/60 rounded-xl bg-card overflow-hidden">
        <button
          onClick={() => toggleSection("education")}
          className="w-full flex items-center justify-between p-4 font-semibold text-sm hover:bg-muted/30 transition-colors text-left"
        >
          <div className="flex items-center gap-2 text-primary">
            <GraduationCap className="h-4 w-4" /> Education ({data.education.length})
          </div>
          {openSections.education ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </button>
        {openSections.education && (
          <div className="p-4 pt-0 border-t border-border/40 space-y-4 mt-1">
            {data.education.map((edu, idx) => (
              <div key={edu.id} className="p-3 border border-border/50 rounded-lg bg-muted/20 space-y-3">
                <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                  <span className="text-xs font-bold">Education #{idx + 1}</span>
                  <Button variant="ghost" size="icon-sm" onClick={() => deleteEducation(edu.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium block mb-1">Degree</label>
                    <Input value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} className="h-8 text-xs" />
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1">Institution</label>
                    <Input value={edu.institution} onChange={(e) => updateEducation(edu.id, "institution", e.target.value)} className="h-8 text-xs" />
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1">Graduation Year</label>
                    <Input value={edu.endDate} onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)} className="h-8 text-xs" />
                  </div>
                </div>
              </div>
            ))}
            <Button onClick={addEducation} variant="outline" size="sm" className="w-full border-dashed border-primary/40 text-primary hover:bg-primary/10 cursor-pointer">
              <Plus className="h-4 w-4 mr-1" /> Add Education
            </Button>
          </div>
        )}
      </div>

      {/* 7. Reorder & Visibility Manager */}
      <div className="border border-border/60 rounded-xl bg-card overflow-hidden">
        <button
          onClick={() => toggleSection("reorder")}
          className="w-full flex items-center justify-between p-4 font-semibold text-sm hover:bg-muted/30 transition-colors text-left"
        >
          <div className="flex items-center gap-2 text-primary">
            <ArrowUp className="h-4 w-4" /> Reorder &amp; Visibility Manager
          </div>
          {openSections.reorder ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </button>
        {openSections.reorder && (
          <div className="p-4 pt-0 border-t border-border/40 space-y-2 mt-1">
            <p className="text-xs text-muted-foreground mb-2">Reorder sections up/down or toggle show/hide (👁) on live preview.</p>
            {data.sectionOrder.map((key, idx) => (
              <div key={key} className="flex items-center justify-between p-2 rounded-lg border border-border/50 bg-muted/20 text-xs font-semibold">
                <div className="flex items-center gap-2 capitalize">
                  <span>{key}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon-sm" onClick={() => toggleVisibility(key)} title="Toggle Visibility">
                    {data.sectionVisibility[key] ? <Eye className="h-3.5 w-3.5 text-emerald-500" /> : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
                  </Button>
                  <Button variant="ghost" size="icon-sm" disabled={idx === 0} onClick={() => moveSection(idx, "up")}>
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" disabled={idx === data.sectionOrder.length - 1} onClick={() => moveSection(idx, "down")}>
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
