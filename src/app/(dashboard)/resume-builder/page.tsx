"use client"

import { useState } from "react"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Save, FileText, Download, Bold, Italic, Heading2, List, LayoutTemplate } from "lucide-react"

const templates: Record<string, string> = {
  professional: `<h2>Your Name</h2>
<p><strong>Job Title</strong> | your.email@example.com | (123) 456-7890 | City, State</p>
<p>LinkedIn: linkedin.com/in/yourname | Portfolio: yourportfolio.com</p>

<h2>Professional Summary</h2>
<p>Results-driven professional with X+ years of experience in [industry/field]. Proven track record in [key achievement area] with expertise in [skill 1], [skill 2], and [skill 3]. Seeking to leverage my background in [specific area] to contribute to [target company/role].</p>

<h2>Work Experience</h2>
<p><strong>Job Title — Company Name</strong> (Month Year – Present)</p>
<ul>
  <li>Led [project/initiative] resulting in [quantified outcome, e.g., 30% revenue increase]</li>
  <li>Managed a team of [X] to deliver [specific deliverable] on time and under budget</li>
  <li>Implemented [tool/process] that improved [metric] by [percentage]</li>
</ul>

<p><strong>Previous Job Title — Company Name</strong> (Month Year – Month Year)</p>
<ul>
  <li>Developed [feature/product] used by [X] users, increasing engagement by [X]%</li>
  <li>Collaborated with cross-functional teams to [specific accomplishment]</li>
</ul>

<h2>Education</h2>
<p><strong>Degree — University Name</strong> (Graduation Year)</p>

<h2>Skills</h2>
<p>Skill 1, Skill 2, Skill 3, Skill 4, Skill 5</p>`,

  modern: `<h2>YOUR NAME</h2>
<p>email@example.com • (123) 456-7890 • linkedin.com/in/name • github.com/name</p>

<h2>ABOUT</h2>
<p>Creative and detail-oriented [role] passionate about [domain]. I bring [X] years of hands-on experience building [type of work] that [impact]. I thrive in fast-paced environments and love turning complex problems into elegant solutions.</p>

<h2>EXPERIENCE</h2>
<p><strong>[Role] @ [Company]</strong> — [Duration]</p>
<ul>
  <li>[Achievement with metric]</li>
  <li>[Achievement with metric]</li>
  <li>[Key responsibility]</li>
</ul>

<h2>PROJECTS</h2>
<p><strong>[Project Name]</strong> — [Tech Stack]</p>
<ul>
  <li>[What it does and why it matters]</li>
  <li>[Key technical decisions or results]</li>
</ul>

<h2>EDUCATION</h2>
<p><strong>[Degree]</strong> — [University] ([Year])</p>

<h2>TECH STACK</h2>
<p>[Skill 1] • [Skill 2] • [Skill 3] • [Skill 4] • [Skill 5]</p>`,

  minimal: `<h2>Name</h2>
<p>email@example.com | City, Country</p>

<h2>Summary</h2>
<p>Brief 2-3 sentence summary of who you are and what you bring to the table.</p>

<h2>Experience</h2>
<p><strong>Role — Company</strong> (Year–Year)</p>
<ul>
  <li>Key accomplishment with measurable impact</li>
  <li>Key accomplishment with measurable impact</li>
</ul>

<h2>Education</h2>
<p><strong>Degree</strong> — University (Year)</p>

<h2>Skills</h2>
<p>List your top 5-8 skills here</p>`,

  blank: `<h2>Start typing your resume here...</h2>
<p>Use the toolbar above to format your content.</p>`
}

const templateMeta = [
  { id: "professional", name: "Professional", description: "Classic corporate format with detailed sections" },
  { id: "modern", name: "Modern Tech", description: "Clean format ideal for tech & startup roles" },
  { id: "minimal", name: "Minimal", description: "Simple and concise, best for experienced professionals" },
  { id: "blank", name: "Blank", description: "Start from scratch" },
]

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/20">
      <Button variant="ghost" size="icon-sm" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-muted' : ''}>
        <Bold className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon-sm" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-muted' : ''}>
        <Italic className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon-sm" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}>
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon-sm" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-muted' : ''}>
        <List className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default function ResumeBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const editor = useEditor({
    extensions: [StarterKit],
    content: templates.professional,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base focus:outline-none min-h-[500px] p-6',
      },
    },
  })

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    if (editor) {
      editor.commands.setContent(templates[templateId])
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Resume Builder</h2>
          <p className="text-muted-foreground mt-1">Choose a professional template and customize with the editor.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
        </div>
      </div>

      {/* Template Selector */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <LayoutTemplate className="h-5 w-5 text-primary" />
            Choose Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {templateMeta.map((t) => (
              <button
                key={t.id}
                onClick={() => handleTemplateSelect(t.id)}
                className={`text-left p-4 rounded-lg border-2 transition-all hover:border-primary/50 ${
                  selectedTemplate === t.id ? 'border-primary bg-primary/5' : 'border-muted'
                }`}
              >
                <span className="block font-medium text-sm">{t.name}</span>
                <span className="block text-xs text-muted-foreground mt-1">{t.description}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <Card className="flex flex-col shadow-sm border-muted">
          <CardHeader className="border-b p-0 bg-muted/10 rounded-t-lg">
            <MenuBar editor={editor} />
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto bg-background rounded-b-lg">
            <EditorContent editor={editor} />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-3">
                <li className="flex gap-2"><span className="text-primary font-bold">1.</span> Start every bullet with a strong action verb.</li>
                <li className="flex gap-2"><span className="text-primary font-bold">2.</span> Quantify achievements with numbers and percentages.</li>
                <li className="flex gap-2"><span className="text-primary font-bold">3.</span> Tailor your summary for each job application.</li>
                <li className="flex gap-2"><span className="text-primary font-bold">4.</span> Keep it to 1-2 pages maximum.</li>
                <li className="flex gap-2"><span className="text-primary font-bold">5.</span> Use keywords from the job description.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-sm">Pro Tip</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                After building your resume, use the <strong>ATS Analyzer</strong> to check how well it matches a specific job description, or the <strong>Proposal Generator</strong> to create a cover letter.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
