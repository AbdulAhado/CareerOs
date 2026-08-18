import { ResumeData, CustomizationSettings } from "./types"
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx"

/**
 * PDF Export: Triggers browser print dialog formatted as clean A4 paper page
 */
export function exportToPDF(resumeHtml: string, customization: CustomizationSettings) {
  const printWindow = window.open("", "_blank")
  if (!printWindow) return

  const fontStack =
    customization.fontStyle === "serif"
      ? "Merriweather, Georgia, serif"
      : customization.fontStyle === "mono"
      ? "'Fira Code', 'Courier New', monospace"
      : "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${customization.templateId.toUpperCase()} Resume - CareerOS</title>
        <style>
          @page {
            size: A4;
            margin: ${customization.margins === "compact" ? "12mm" : customization.margins === "wide" ? "24mm" : "18mm"};
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: ${fontStack};
            color: #1e293b;
            background: #ffffff;
            margin: 0;
            padding: 0;
            line-height: ${customization.spacing === "compact" ? "1.35" : customization.spacing === "spacious" ? "1.65" : "1.5"};
          }
          a { color: inherit; text-decoration: none; }
          ul { margin-top: 4px; margin-bottom: 8px; padding-left: 20px; }
          li { margin-bottom: 3px; font-size: 13px; color: #334155; }
          h1, h2, h3, p { margin: 0; }
          .page-break { page-break-after: always; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div style="width: 100%;">
          ${resumeHtml}
        </div>
      </body>
    </html>
  `)

  printWindow.document.close()
  printWindow.focus()
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 300)
}

/**
 * DOCX Export: Generates a real Microsoft Word .docx document using the `docx` library
 */
export async function exportToDOCX(data: ResumeData, customization: CustomizationSettings) {
  const children: Paragraph[] = []

  // Name Header
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.personal.fullName.toUpperCase(),
          bold: true,
          size: 32, // 16pt
          color: customization.accentColor.replace("#", ""),
        }),
      ],
      alignment: AlignmentType.LEFT,
      spacing: { after: 60 },
    })
  )

  // Title & Contact Info
  const contactParts: string[] = []
  if (data.personal.jobTitle) contactParts.push(data.personal.jobTitle)
  if (data.personal.email) contactParts.push(data.personal.email)
  if (data.personal.phone) contactParts.push(data.personal.phone)
  if (data.personal.location) contactParts.push(data.personal.location)

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: contactParts.join("  |  "),
          size: 20,
          color: "475569",
        }),
      ],
      spacing: { after: 120 },
    })
  )

  // Render Sections according to sectionOrder and sectionVisibility
  for (const key of data.sectionOrder) {
    if (!data.sectionVisibility[key]) continue

    if (key === "summary" && data.summary.trim()) {
      children.push(
        new Paragraph({
          text: "PROFESSIONAL SUMMARY",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 180, after: 80 },
        })
      )
      children.push(
        new Paragraph({
          children: [new TextRun({ text: data.summary, size: 21 })],
          spacing: { after: 140 },
        })
      )
    }

    if (key === "experience" && data.experience.length > 0) {
      children.push(
        new Paragraph({
          text: "WORK EXPERIENCE",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 180, after: 80 },
        })
      )

      data.experience.forEach((exp) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: exp.title, bold: true, size: 22 }),
              new TextRun({ text: ` — ${exp.company}`, bold: true, size: 22, color: "334155" }),
              new TextRun({
                text: `  (${exp.startDate} - ${exp.currentlyWorking ? "Present" : exp.endDate})`,
                italics: true,
                size: 20,
                color: "64748b",
              }),
            ],
            spacing: { before: 60, after: 40 },
          })
        )

        // Bullets
        const bullets = exp.description
          .split("\n")
          .map((b) => b.replace(/^•\s*/, "").trim())
          .filter(Boolean)

        bullets.forEach((bulletText) => {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: bulletText, size: 20 })],
              bullet: { level: 0 },
              spacing: { after: 30 },
            })
          )
        })
      })
    }

    if (key === "projects" && data.projects.length > 0) {
      children.push(
        new Paragraph({
          text: "PROJECTS",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 180, after: 80 },
        })
      )

      data.projects.forEach((proj) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: proj.name, bold: true, size: 22 }),
              new TextRun({ text: ` (${proj.technologies})`, italics: true, size: 19, color: "475569" }),
            ],
            spacing: { before: 60, after: 40 },
          })
        )
        children.push(
          new Paragraph({
            children: [new TextRun({ text: proj.description, size: 20 })],
            spacing: { after: 80 },
          })
        )
      })
    }

    if (key === "skills" && data.skills.length > 0) {
      children.push(
        new Paragraph({
          text: "SKILLS & COMPETENCIES",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 180, after: 80 },
        })
      )

      const skillNames = data.skills.map((s) => s.name).join(" • ")
      children.push(
        new Paragraph({
          children: [new TextRun({ text: skillNames, size: 21 })],
          spacing: { after: 140 },
        })
      )
    }

    if (key === "education" && data.education.length > 0) {
      children.push(
        new Paragraph({
          text: "EDUCATION",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 180, after: 80 },
        })
      )

      data.education.forEach((edu) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: edu.degree, bold: true, size: 22 }),
              new TextRun({ text: ` — ${edu.institution}`, size: 22 }),
              new TextRun({ text: ` (${edu.endDate})`, italics: true, size: 20, color: "64748b" }),
            ],
            spacing: { after: 60 },
          })
        )
      })
    }

    if (key === "certifications" && data.certifications.length > 0) {
      children.push(
        new Paragraph({
          text: "CERTIFICATIONS",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 180, after: 80 },
        })
      )

      data.certifications.forEach((cert) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${cert.name} — `, bold: true, size: 21 }),
              new TextRun({ text: `${cert.organization} (${cert.date})`, size: 21 }),
            ],
            spacing: { after: 40 },
          })
        )
      })
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: customization.margins === "compact" ? 720 : 1080,
              bottom: customization.margins === "compact" ? 720 : 1080,
              left: customization.margins === "compact" ? 720 : 1080,
              right: customization.margins === "compact" ? 720 : 1080,
            },
          },
        },
        children,
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${data.personal.fullName.replace(/\s+/g, "_")}_Resume.docx`
  a.click()
  window.URL.revokeObjectURL(url)
}

/**
 * HTML Export: Standalone HTML document with CSS & print setup
 */
export function exportToHTML(resumeHtml: string, customization: CustomizationSettings, fullName: string) {
  const fullDocument = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${fullName} - Resume</title>
  <style>
    @page { size: A4; margin: 18mm; }
    body {
      font-family: Inter, system-ui, -apple-system, sans-serif;
      color: #1e293b;
      background: #ffffff;
      margin: 0;
      padding: 24px;
      line-height: 1.5;
    }
    a { color: inherit; text-decoration: none; }
  </style>
</head>
<body>
  ${resumeHtml}
</body>
</html>`

  const blob = new Blob([fullDocument], { type: "text/html" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${fullName.replace(/\s+/g, "_")}_Resume.html`
  a.click()
  window.URL.revokeObjectURL(url)
}
