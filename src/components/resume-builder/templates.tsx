import React from "react"
import { ResumeData, CustomizationSettings, SectionKey } from "./types"

interface TemplateProps {
  data: ResumeData
  customization: CustomizationSettings
}

// Utility helper to render sections by sectionOrder and sectionVisibility
function renderOrderedSections(
  data: ResumeData,
  sectionRenderers: Record<SectionKey, () => React.ReactNode>
) {
  return data.sectionOrder.map((key) => {
    if (!data.sectionVisibility[key]) return null
    const renderer = sectionRenderers[key]
    return renderer ? <React.Fragment key={key}>{renderer()}</React.Fragment> : null
  })
}

// Font family getter helper
function getFontFamily(fontStyle: string) {
  switch (fontStyle) {
    case "serif":
      return "Merriweather, Georgia, serif"
    case "mono":
      return "'Fira Code', 'Courier New', monospace"
    case "clean":
      return "'Geist', 'Outfit', sans-serif"
    default:
      return "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  }
}

// Line height & spacing helper
function getSpacingStyle(spacing: string) {
  switch (spacing) {
    case "compact":
      return { lineHeight: 1.35, sectionMargin: "12px", itemMargin: "6px" }
    case "spacious":
      return { lineHeight: 1.65, sectionMargin: "24px", itemMargin: "14px" }
    default:
      return { lineHeight: 1.5, sectionMargin: "18px", itemMargin: "10px" }
  }
}

// Page margin helper
function getMarginPadding(margins: string) {
  switch (margins) {
    case "compact":
      return "16px 20px"
    case "wide":
      return "36px 40px"
    default:
      return "28px 32px"
  }
}

/* ─────────────────────────────────────────────────────────────
   1. EXECUTIVE LEADER TEMPLATE
   ───────────────────────────────────────────────────────────── */
export function ExecutiveTemplate({ data, customization }: TemplateProps) {
  const accent = customization.accentColor
  const font = getFontFamily(customization.fontStyle)
  const spacing = getSpacingStyle(customization.spacing)
  const padding = getMarginPadding(customization.margins)

  const sectionRenderers: Record<SectionKey, () => React.ReactNode> = {
    summary: () =>
      data.summary ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ color: accent, fontSize: "14px", fontWeight: 700, borderBottom: `2px solid ${accent}`, paddingBottom: "2px", marginBottom: "6px", textTransform: "uppercase" }}>
            Executive Summary
          </h2>
          <p style={{ fontSize: "12.5px", color: "#334155", lineHeight: spacing.lineHeight }}>{data.summary}</p>
        </div>
      ) : null,

    experience: () =>
      data.experience.length > 0 ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ color: accent, fontSize: "14px", fontWeight: 700, borderBottom: `2px solid ${accent}`, paddingBottom: "2px", marginBottom: "8px", textTransform: "uppercase" }}>
            Professional Experience
          </h2>
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: spacing.itemMargin }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700, fontSize: "13.5px", color: "#0f172a" }}>{exp.title}</span>
                <span style={{ fontSize: "11.5px", color: "#64748b", fontWeight: 500 }}>
                  {exp.startDate} – {exp.currentlyWorking ? "Present" : exp.endDate}
                </span>
              </div>
              <div style={{ fontSize: "12px", color: accent, fontWeight: 600, marginBottom: "4px" }}>
                {exp.company} {exp.location && `• ${exp.location}`}
              </div>
              <ul style={{ margin: 0, paddingLeft: "18px" }}>
                {exp.description.split("\n").filter(Boolean).map((bullet, idx) => (
                  <li key={idx} style={{ fontSize: "12px", color: "#334155", marginBottom: "2px" }}>
                    {bullet.replace(/^•\s*/, "")}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null,

    projects: () =>
      data.projects.length > 0 ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ color: accent, fontSize: "14px", fontWeight: 700, borderBottom: `2px solid ${accent}`, paddingBottom: "2px", marginBottom: "8px", textTransform: "uppercase" }}>
            Key Projects
          </h2>
          {data.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: spacing.itemMargin }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700, fontSize: "13px", color: "#0f172a" }}>{proj.name}</span>
                <span style={{ fontSize: "11px", color: "#64748b" }}>{proj.technologies}</span>
              </div>
              <p style={{ fontSize: "12px", color: "#334155", marginTop: "2px" }}>{proj.description}</p>
            </div>
          ))}
        </div>
      ) : null,

    skills: () =>
      data.skills.length > 0 ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ color: accent, fontSize: "14px", fontWeight: 700, borderBottom: `2px solid ${accent}`, paddingBottom: "2px", marginBottom: "6px", textTransform: "uppercase" }}>
            Core Competencies
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {data.skills.map((s) => (
              <span key={s.id} style={{ background: "#f1f5f9", color: "#334155", padding: "2px 8px", borderRadius: "4px", fontSize: "11.5px", fontWeight: 600 }}>
                {s.name}
              </span>
            ))}
          </div>
        </div>
      ) : null,

    education: () =>
      data.education.length > 0 ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ color: accent, fontSize: "14px", fontWeight: 700, borderBottom: `2px solid ${accent}`, paddingBottom: "2px", marginBottom: "6px", textTransform: "uppercase" }}>
            Education
          </h2>
          {data.education.map((edu) => (
            <div key={edu.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <div>
                <strong style={{ fontSize: "12.5px", color: "#0f172a" }}>{edu.degree}</strong>
                <div style={{ fontSize: "11.5px", color: "#475569" }}>{edu.institution} {edu.location && `• ${edu.location}`}</div>
              </div>
              <span style={{ fontSize: "11.5px", color: "#64748b" }}>{edu.endDate}</span>
            </div>
          ))}
        </div>
      ) : null,

    certifications: () =>
      data.certifications.length > 0 ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ color: accent, fontSize: "14px", fontWeight: 700, borderBottom: `2px solid ${accent}`, paddingBottom: "2px", marginBottom: "6px", textTransform: "uppercase" }}>
            Certifications
          </h2>
          {data.certifications.map((c) => (
            <div key={c.id} style={{ fontSize: "12px", color: "#334155", marginBottom: "3px" }}>
              <strong>{c.name}</strong> — {c.organization} ({c.date})
            </div>
          ))}
        </div>
      ) : null,

    languages: () =>
      data.languages.length > 0 ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ color: accent, fontSize: "14px", fontWeight: 700, borderBottom: `2px solid ${accent}`, paddingBottom: "2px", marginBottom: "6px", textTransform: "uppercase" }}>
            Languages
          </h2>
          <p style={{ fontSize: "12px", color: "#334155" }}>
            {data.languages.map((l) => `${l.language} (${l.proficiency})`).join(" • ")}
          </p>
        </div>
      ) : null,

    awards: () =>
      data.awards.length > 0 ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ color: accent, fontSize: "14px", fontWeight: 700, borderBottom: `2px solid ${accent}`, paddingBottom: "2px", marginBottom: "6px", textTransform: "uppercase" }}>
            Honors &amp; Awards
          </h2>
          {data.awards.map((a) => (
            <div key={a.id} style={{ fontSize: "12px", color: "#334155", marginBottom: "3px" }}>
              <strong>{a.name}</strong> — {a.organization} ({a.date})
            </div>
          ))}
        </div>
      ) : null,

    custom: () =>
      data.customSections.length > 0 ? (
        <>
          {data.customSections.map((cs) => (
            <div key={cs.id} style={{ marginBottom: spacing.sectionMargin }}>
              <h2 style={{ color: accent, fontSize: "14px", fontWeight: 700, borderBottom: `2px solid ${accent}`, paddingBottom: "2px", marginBottom: "6px", textTransform: "uppercase" }}>
                {cs.title}
              </h2>
              <p style={{ fontSize: "12px", color: "#334155" }}>{cs.content}</p>
            </div>
          ))}
        </>
      ) : null,
  }

  return (
    <div style={{ fontFamily: font, padding, background: "#ffffff", color: "#1e293b", width: "100%", height: "100%", boxSizing: "border-box" }}>
      {/* Executive Header */}
      <div style={{ borderBottom: `3px solid ${accent}`, paddingBottom: "12px", marginBottom: "16px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", margin: 0 }}>
          {data.personal.fullName || "Your Full Name"}
        </h1>
        <div style={{ fontSize: "14px", fontWeight: 600, color: accent, marginTop: "2px" }}>
          {data.personal.jobTitle || "Professional Title"}
        </div>

        {/* Contact Info Bar */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "8px", fontSize: "11px", color: "#475569" }}>
          {data.personal.email && <span>✉ {data.personal.email}</span>}
          {data.personal.phone && <span>📞 {data.personal.phone}</span>}
          {data.personal.location && <span>📍 {data.personal.location}</span>}
          {data.personal.linkedin && <span>🔗 {data.personal.linkedin}</span>}
          {data.personal.github && <span>💻 {data.personal.github}</span>}
        </div>
      </div>

      {/* Render Sections */}
      {renderOrderedSections(data, sectionRenderers)}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   2. MODERN TECH TEMPLATE
   ───────────────────────────────────────────────────────────── */
export function ModernTemplate({ data, customization }: TemplateProps) {
  const accent = customization.accentColor
  const font = getFontFamily(customization.fontStyle)
  const spacing = getSpacingStyle(customization.spacing)
  const padding = getMarginPadding(customization.margins)

  const sectionRenderers: Record<SectionKey, () => React.ReactNode> = {
    summary: () =>
      data.summary ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ color: accent, fontSize: "12px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
            // SUMMARY
          </h2>
          <p style={{ fontSize: "12px", color: "#334155", lineHeight: spacing.lineHeight }}>{data.summary}</p>
        </div>
      ) : null,

    skills: () =>
      data.skills.length > 0 ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ color: accent, fontSize: "12px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
            // TECH STACK
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {data.skills.map((s) => (
              <span key={s.id} style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}40`, padding: "3px 9px", borderRadius: "12px", fontSize: "11px", fontWeight: 600 }}>
                {s.name}
              </span>
            ))}
          </div>
        </div>
      ) : null,

    experience: () =>
      data.experience.length > 0 ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ color: accent, fontSize: "12px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
            // EXPERIENCE
          </h2>
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: spacing.itemMargin, paddingLeft: "10px", borderLeft: `2px solid ${accent}30` }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ fontSize: "13px", color: "#0f172a" }}>{exp.title} <span style={{ color: accent }}>@ {exp.company}</span></strong>
                <span style={{ fontSize: "11px", color: "#64748b" }}>{exp.startDate} – {exp.currentlyWorking ? "Present" : exp.endDate}</span>
              </div>
              <ul style={{ margin: "4px 0 0 0", paddingLeft: "16px" }}>
                {exp.description.split("\n").filter(Boolean).map((bullet, idx) => (
                  <li key={idx} style={{ fontSize: "11.5px", color: "#475569" }}>{bullet.replace(/^•\s*/, "")}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null,

    projects: () =>
      data.projects.length > 0 ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ color: accent, fontSize: "12px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
            // FEATURED PROJECTS
          </h2>
          {data.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: spacing.itemMargin }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ fontSize: "12.5px", color: "#0f172a" }}>{proj.name}</strong>
                <span style={{ fontSize: "11px", color: accent, fontWeight: 600 }}>{proj.technologies}</span>
              </div>
              <p style={{ fontSize: "11.5px", color: "#475569", marginTop: "2px" }}>{proj.description}</p>
            </div>
          ))}
        </div>
      ) : null,

    education: () =>
      data.education.length > 0 ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ color: accent, fontSize: "12px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
            // EDUCATION
          </h2>
          {data.education.map((edu) => (
            <div key={edu.id} style={{ fontSize: "12px", color: "#334155" }}>
              <strong>{edu.degree}</strong> • {edu.institution} ({edu.endDate})
            </div>
          ))}
        </div>
      ) : null,

    certifications: () =>
      data.certifications.length > 0 ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ color: accent, fontSize: "12px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
            // CERTIFICATIONS
          </h2>
          {data.certifications.map((c) => (
            <div key={c.id} style={{ fontSize: "11.5px", color: "#334155" }}>{c.name} — {c.organization} ({c.date})</div>
          ))}
        </div>
      ) : null,

    languages: () =>
      data.languages.length > 0 ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ color: accent, fontSize: "12px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
            // LANGUAGES
          </h2>
          <p style={{ fontSize: "11.5px", color: "#334155" }}>{data.languages.map((l) => `${l.language} (${l.proficiency})`).join(" • ")}</p>
        </div>
      ) : null,

    awards: () =>
      data.awards.length > 0 ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ color: accent, fontSize: "12px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
            // AWARDS
          </h2>
          {data.awards.map((a) => (
            <div key={a.id} style={{ fontSize: "11.5px", color: "#334155" }}>{a.name} — {a.organization} ({a.date})</div>
          ))}
        </div>
      ) : null,

    custom: () =>
      data.customSections.map((cs) => (
        <div key={cs.id} style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ color: accent, fontSize: "12px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
            // {cs.title.toUpperCase()}
          </h2>
          <p style={{ fontSize: "11.5px", color: "#334155" }}>{cs.content}</p>
        </div>
      )),
  }

  return (
    <div style={{ fontFamily: font, padding, background: "#ffffff", color: "#1e293b", width: "100%", height: "100%", boxSizing: "border-box" }}>
      <div style={{ background: `${accent}0d`, border: `1px solid ${accent}25`, padding: "16px", borderRadius: "8px", marginBottom: "16px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", margin: 0 }}>{data.personal.fullName || "Your Full Name"}</h1>
        <div style={{ fontSize: "13px", fontWeight: 700, color: accent, marginTop: "2px" }}>{data.personal.jobTitle}</div>
        <div style={{ fontSize: "11px", color: "#64748b", marginTop: "6px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>• {data.personal.phone}</span>}
          {data.personal.location && <span>• {data.personal.location}</span>}
          {data.personal.github && <span>• {data.personal.github}</span>}
        </div>
      </div>
      {renderOrderedSections(data, sectionRenderers)}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   3. MINIMALIST TEMPLATE
   ───────────────────────────────────────────────────────────── */
export function MinimalTemplate({ data, customization }: TemplateProps) {
  const font = getFontFamily(customization.fontStyle)
  const spacing = getSpacingStyle(customization.spacing)
  const padding = getMarginPadding(customization.margins)
  const accent = customization.accentColor

  const sectionRenderers: Record<SectionKey, () => React.ReactNode> = {
    summary: () =>
      data.summary ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <p style={{ fontSize: "12px", color: "#475569", fontStyle: "italic", lineHeight: spacing.lineHeight }}>{data.summary}</p>
        </div>
      ) : null,

    experience: () =>
      data.experience.length > 0 ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#64748b", marginBottom: "8px" }}>Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: spacing.itemMargin }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}>
                <strong>{exp.title}, {exp.company}</strong>
                <span style={{ color: "#94a3b8", fontSize: "11px" }}>{exp.startDate}–{exp.currentlyWorking ? "Present" : exp.endDate}</span>
              </div>
              <ul style={{ margin: "4px 0 0 0", paddingLeft: "16px" }}>
                {exp.description.split("\n").filter(Boolean).map((bullet, idx) => (
                  <li key={idx} style={{ fontSize: "11.5px", color: "#334155" }}>{bullet.replace(/^•\s*/, "")}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null,

    projects: () =>
      data.projects.length > 0 ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#64748b", marginBottom: "8px" }}>Projects</h2>
          {data.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: "6px", fontSize: "12px" }}>
              <strong>{proj.name}</strong> — <span style={{ color: "#64748b" }}>{proj.description}</span>
            </div>
          ))}
        </div>
      ) : null,

    skills: () =>
      data.skills.length > 0 ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#64748b", marginBottom: "6px" }}>Skills</h2>
          <p style={{ fontSize: "11.5px", color: "#334155" }}>{data.skills.map((s) => s.name).join("  •  ")}</p>
        </div>
      ) : null,

    education: () =>
      data.education.length > 0 ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#64748b", marginBottom: "6px" }}>Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} style={{ fontSize: "12px" }}>
              <strong>{edu.degree}</strong>, {edu.institution} ({edu.endDate})
            </div>
          ))}
        </div>
      ) : null,

    certifications: () =>
      data.certifications.length > 0 ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#64748b", marginBottom: "6px" }}>Certifications</h2>
          {data.certifications.map((c) => (
            <div key={c.id} style={{ fontSize: "11.5px" }}>{c.name} ({c.organization})</div>
          ))}
        </div>
      ) : null,

    languages: () =>
      data.languages.length > 0 ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#64748b", marginBottom: "6px" }}>Languages</h2>
          <p style={{ fontSize: "11.5px" }}>{data.languages.map((l) => `${l.language}`).join(", ")}</p>
        </div>
      ) : null,

    awards: () =>
      data.awards.length > 0 ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#64748b", marginBottom: "6px" }}>Awards</h2>
          {data.awards.map((a) => (
            <div key={a.id} style={{ fontSize: "11.5px" }}>{a.name} ({a.date})</div>
          ))}
        </div>
      ) : null,

    custom: () =>
      data.customSections.map((cs) => (
        <div key={cs.id} style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#64748b", marginBottom: "6px" }}>{cs.title}</h2>
          <p style={{ fontSize: "11.5px" }}>{cs.content}</p>
        </div>
      )),
  }

  return (
    <div style={{ fontFamily: font, padding, background: "#ffffff", color: "#0f172a", width: "100%", height: "100%", boxSizing: "border-box" }}>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 300, letterSpacing: "1px", margin: 0 }}>{data.personal.fullName || "Your Full Name"}</h1>
        <div style={{ fontSize: "12px", color: accent, marginTop: "4px", letterSpacing: "0.5px" }}>{data.personal.jobTitle}</div>
        <div style={{ fontSize: "10.5px", color: "#94a3b8", marginTop: "6px" }}>
          {[data.personal.email, data.personal.phone, data.personal.location, data.personal.website].filter(Boolean).join("  |  ")}
        </div>
      </div>
      {renderOrderedSections(data, sectionRenderers)}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   4. ATS FRIENDLY TEMPLATE (Single column, 100% Parser Compatible)
   ───────────────────────────────────────────────────────────── */
export function ATSTemplate({ data, customization }: TemplateProps) {
  const font = "Arial, sans-serif" // Standard ATS safe font
  const spacing = getSpacingStyle(customization.spacing)
  const padding = getMarginPadding(customization.margins)

  const sectionRenderers: Record<SectionKey, () => React.ReactNode> = {
    summary: () =>
      data.summary ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ fontSize: "13px", fontWeight: "bold", borderBottom: "1px solid #000", paddingBottom: "2px", marginBottom: "4px", textTransform: "uppercase" }}>
            SUMMARY
          </h2>
          <p style={{ fontSize: "12px", color: "#000", lineHeight: spacing.lineHeight }}>{data.summary}</p>
        </div>
      ) : null,

    experience: () =>
      data.experience.length > 0 ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ fontSize: "13px", fontWeight: "bold", borderBottom: "1px solid #000", paddingBottom: "2px", marginBottom: "6px", textTransform: "uppercase" }}>
            WORK EXPERIENCE
          </h2>
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: spacing.itemMargin }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold", fontSize: "12.5px" }}>{exp.title} — {exp.company}</span>
                <span style={{ fontSize: "11.5px" }}>{exp.startDate} - {exp.currentlyWorking ? "Present" : exp.endDate}</span>
              </div>
              {exp.location && <div style={{ fontSize: "11px", fontStyle: "italic" }}>{exp.location}</div>}
              <ul style={{ margin: "4px 0", paddingLeft: "20px" }}>
                {exp.description.split("\n").filter(Boolean).map((bullet, idx) => (
                  <li key={idx} style={{ fontSize: "11.5px", color: "#000" }}>{bullet.replace(/^•\s*/, "")}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null,

    skills: () =>
      data.skills.length > 0 ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ fontSize: "13px", fontWeight: "bold", borderBottom: "1px solid #000", paddingBottom: "2px", marginBottom: "4px", textTransform: "uppercase" }}>
            TECHNICAL SKILLS
          </h2>
          <p style={{ fontSize: "12px", color: "#000" }}>
            {data.skills.map((s) => s.name).join(", ")}
          </p>
        </div>
      ) : null,

    projects: () =>
      data.projects.length > 0 ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ fontSize: "13px", fontWeight: "bold", borderBottom: "1px solid #000", paddingBottom: "2px", marginBottom: "6px", textTransform: "uppercase" }}>
            PROJECTS
          </h2>
          {data.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: "6px" }}>
              <div style={{ fontWeight: "bold", fontSize: "12px" }}>{proj.name} ({proj.technologies})</div>
              <p style={{ fontSize: "11.5px", margin: "2px 0" }}>{proj.description}</p>
            </div>
          ))}
        </div>
      ) : null,

    education: () =>
      data.education.length > 0 ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ fontSize: "13px", fontWeight: "bold", borderBottom: "1px solid #000", paddingBottom: "2px", marginBottom: "4px", textTransform: "uppercase" }}>
            EDUCATION
          </h2>
          {data.education.map((edu) => (
            <div key={edu.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
              <span><strong>{edu.degree}</strong>, {edu.institution}</span>
              <span>{edu.endDate}</span>
            </div>
          ))}
        </div>
      ) : null,

    certifications: () =>
      data.certifications.length > 0 ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ fontSize: "13px", fontWeight: "bold", borderBottom: "1px solid #000", paddingBottom: "2px", marginBottom: "4px", textTransform: "uppercase" }}>
            CERTIFICATIONS
          </h2>
          {data.certifications.map((c) => (
            <div key={c.id} style={{ fontSize: "11.5px" }}>{c.name} — {c.organization} ({c.date})</div>
          ))}
        </div>
      ) : null,

    languages: () =>
      data.languages.length > 0 ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ fontSize: "13px", fontWeight: "bold", borderBottom: "1px solid #000", paddingBottom: "2px", marginBottom: "4px", textTransform: "uppercase" }}>
            LANGUAGES
          </h2>
          <p style={{ fontSize: "11.5px" }}>{data.languages.map((l) => `${l.language} (${l.proficiency})`).join(", ")}</p>
        </div>
      ) : null,

    awards: () =>
      data.awards.length > 0 ? (
        <div style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ fontSize: "13px", fontWeight: "bold", borderBottom: "1px solid #000", paddingBottom: "2px", marginBottom: "4px", textTransform: "uppercase" }}>
            HONORS &amp; AWARDS
          </h2>
          {data.awards.map((a) => (
            <div key={a.id} style={{ fontSize: "11.5px" }}>{a.name} — {a.organization} ({a.date})</div>
          ))}
        </div>
      ) : null,

    custom: () =>
      data.customSections.map((cs) => (
        <div key={cs.id} style={{ marginBottom: spacing.sectionMargin }}>
          <h2 style={{ fontSize: "13px", fontWeight: "bold", borderBottom: "1px solid #000", paddingBottom: "2px", marginBottom: "4px", textTransform: "uppercase" }}>
            {cs.title.toUpperCase()}
          </h2>
          <p style={{ fontSize: "11.5px" }}>{cs.content}</p>
        </div>
      )),
  }

  return (
    <div style={{ fontFamily: font, padding, background: "#ffffff", color: "#000000", width: "100%", height: "100%", boxSizing: "border-box" }}>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: "bold", textTransform: "uppercase", margin: 0 }}>
          {data.personal.fullName || "YOUR FULL NAME"}
        </h1>
        <div style={{ fontSize: "12px", marginTop: "2px" }}>{data.personal.jobTitle}</div>
        <div style={{ fontSize: "11px", marginTop: "4px" }}>
          {[data.personal.email, data.personal.phone, data.personal.location, data.personal.linkedin, data.personal.github]
            .filter(Boolean)
            .join(" | ")}
        </div>
      </div>
      {renderOrderedSections(data, sectionRenderers)}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   5. PROFESSIONAL TEMPLATE
   ───────────────────────────────────────────────────────────── */
export function ProfessionalTemplate({ data, customization }: TemplateProps) {
  const accent = customization.accentColor
  const font = getFontFamily(customization.fontStyle)
  const padding = getMarginPadding(customization.margins)

  return (
    <div style={{ fontFamily: font, padding, background: "#ffffff", color: "#1e293b", width: "100%", height: "100%", boxSizing: "border-box" }}>
      <div style={{ background: accent, color: "#ffffff", padding: "16px", borderRadius: "4px", marginBottom: "16px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 800, margin: 0 }}>{data.personal.fullName || "Your Full Name"}</h1>
        <div style={{ fontSize: "13px", opacity: 0.9, marginTop: "2px" }}>{data.personal.jobTitle}</div>
        <div style={{ fontSize: "11px", opacity: 0.85, marginTop: "6px" }}>
          {[data.personal.email, data.personal.phone, data.personal.location].filter(Boolean).join("  •  ")}
        </div>
      </div>
      <ExecutiveTemplate data={data} customization={customization} />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   6. DEVELOPER / TECH TEMPLATE (Projects & Skills First)
   ───────────────────────────────────────────────────────────── */
export function TechTemplate({ data, customization }: TemplateProps) {
  const techOrderData: ResumeData = {
    ...data,
    sectionOrder: ["skills", "projects", "experience", "education", "summary", "certifications", "languages", "awards", "custom"],
  }
  return <ModernTemplate data={techOrderData} customization={customization} />
}

/* ─────────────────────────────────────────────────────────────
   7. ACADEMIC TEMPLATE (Education & Research First)
   ───────────────────────────────────────────────────────────── */
export function AcademicTemplate({ data, customization }: TemplateProps) {
  const academicOrderData: ResumeData = {
    ...data,
    sectionOrder: ["summary", "education", "experience", "projects", "certifications", "skills", "languages", "awards", "custom"],
  }
  return <ExecutiveTemplate data={academicOrderData} customization={customization} />
}

/* ─────────────────────────────────────────────────────────────
   8. CREATIVE TEMPLATE (Stylish 2-Column Sidebar Layout)
   ───────────────────────────────────────────────────────────── */
export function CreativeTemplate({ data, customization }: TemplateProps) {
  const accent = customization.accentColor
  const font = getFontFamily(customization.fontStyle)
  const padding = getMarginPadding(customization.margins)

  return (
    <div style={{ fontFamily: font, background: "#ffffff", color: "#1e293b", width: "100%", height: "100%", display: "flex", boxSizing: "border-box" }}>
      {/* Sidebar 1/3 */}
      <div style={{ width: "32%", background: `${accent}12`, borderRight: `2px solid ${accent}30`, padding, boxSizing: "border-box" }}>
        <h1 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", margin: 0 }}>{data.personal.fullName}</h1>
        <div style={{ fontSize: "12px", color: accent, fontWeight: 700, marginTop: "2px" }}>{data.personal.jobTitle}</div>

        <div style={{ marginTop: "16px", fontSize: "11px", color: "#475569", wordBreak: "break-word" }}>
          <strong style={{ color: accent, display: "block", marginBottom: "4px" }}>CONTACT</strong>
          {data.personal.email && <div>{data.personal.email}</div>}
          {data.personal.phone && <div>{data.personal.phone}</div>}
          {data.personal.location && <div>{data.personal.location}</div>}
          {data.personal.linkedin && <div>{data.personal.linkedin}</div>}
        </div>

        {data.skills.length > 0 && (
          <div style={{ marginTop: "16px" }}>
            <strong style={{ color: accent, fontSize: "11px", display: "block", marginBottom: "6px" }}>SKILLS</strong>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {data.skills.map((s) => (
                <span key={s.id} style={{ background: accent, color: "#fff", fontSize: "10px", padding: "2px 6px", borderRadius: "3px" }}>
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.education.length > 0 && (
          <div style={{ marginTop: "16px" }}>
            <strong style={{ color: accent, fontSize: "11px", display: "block", marginBottom: "6px" }}>EDUCATION</strong>
            {data.education.map((e) => (
              <div key={e.id} style={{ fontSize: "11px", marginBottom: "6px" }}>
                <strong>{e.degree}</strong>
                <div>{e.institution}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content 2/3 */}
      <div style={{ width: "68%", padding, boxSizing: "border-box" }}>
        {data.summary && (
          <div style={{ marginBottom: "14px" }}>
            <h2 style={{ color: accent, fontSize: "13px", fontWeight: 700, borderBottom: `1px solid ${accent}`, paddingBottom: "2px" }}>PROFILE</h2>
            <p style={{ fontSize: "11.5px", color: "#334155", marginTop: "4px" }}>{data.summary}</p>
          </div>
        )}

        {data.experience.length > 0 && (
          <div style={{ marginBottom: "14px" }}>
            <h2 style={{ color: accent, fontSize: "13px", fontWeight: 700, borderBottom: `1px solid ${accent}`, paddingBottom: "2px" }}>EXPERIENCE</h2>
            {data.experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: "8px" }}>
                <strong style={{ fontSize: "12px" }}>{exp.title} @ {exp.company}</strong>
                <div style={{ fontSize: "10.5px", color: "#64748b" }}>{exp.startDate} - {exp.currentlyWorking ? "Present" : exp.endDate}</div>
                <ul style={{ margin: "2px 0", paddingLeft: "14px", fontSize: "11px" }}>
                  {exp.description.split("\n").filter(Boolean).map((bullet, idx) => (
                    <li key={idx}>{bullet.replace(/^•\s*/, "")}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {data.projects.length > 0 && (
          <div>
            <h2 style={{ color: accent, fontSize: "13px", fontWeight: 700, borderBottom: `1px solid ${accent}`, paddingBottom: "2px" }}>PROJECTS</h2>
            {data.projects.map((p) => (
              <div key={p.id} style={{ fontSize: "11px", marginBottom: "6px" }}>
                <strong>{p.name}</strong> — {p.description}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* Master Router Component */
export function ResumeTemplateRenderer({ data, customization }: TemplateProps) {
  switch (customization.templateId) {
    case "modern":
      return <ModernTemplate data={data} customization={customization} />
    case "minimal":
      return <MinimalTemplate data={data} customization={customization} />
    case "ats":
      return <ATSTemplate data={data} customization={customization} />
    case "professional":
      return <ProfessionalTemplate data={data} customization={customization} />
    case "tech":
      return <TechTemplate data={data} customization={customization} />
    case "academic":
      return <AcademicTemplate data={data} customization={customization} />
    case "creative":
      return <CreativeTemplate data={data} customization={customization} />
    case "executive":
    default:
      return <ExecutiveTemplate data={data} customization={customization} />
  }
}
