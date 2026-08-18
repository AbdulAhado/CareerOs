import React from "react"
import { TemplateId } from "./types"
import { DEFAULT_RESUME_DATA, DEFAULT_CUSTOMIZATION } from "./default-data"
import { ResumeTemplateRenderer } from "./templates"
import { Check } from "lucide-react"

export interface TemplateMetaItem {
  id: TemplateId
  name: string
  description: string
  badge?: string
}

export const ALL_TEMPLATES_META: TemplateMetaItem[] = [
  { id: "executive", name: "Executive Leader", description: "Corporate, elegant, & strong hierarchy for managers & leaders", badge: "Popular" },
  { id: "modern", name: "Modern Tech", description: "Clean tech-oriented layout with accent skill pills", badge: "Trending" },
  { id: "minimal", name: "Minimalist", description: "Lots of whitespace, simple & elegant typography", badge: "Clean" },
  { id: "ats", name: "ATS Friendly", description: "Single-column 100% ATS parser compatible format", badge: "ATS Safe" },
  { id: "professional", name: "Professional", description: "General-purpose corporate layout with two-tone header" },
  { id: "tech", name: "Developer / Tech", description: "Technical emphasis highlighting Skills & Projects first" },
  { id: "academic", name: "Academic", description: "Education & research prioritized for scholars & grads" },
  { id: "creative", name: "Creative Designer", description: "Stylish 2-column sidebar layout for creators & designers" },
]

interface TemplateGalleryProps {
  selectedId: TemplateId
  onSelect: (id: TemplateId) => void
}

export function TemplateGallery({ selectedId, onSelect }: TemplateGalleryProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {ALL_TEMPLATES_META.map((meta) => {
        const isSelected = selectedId === meta.id
        return (
          <div
            key={meta.id}
            onClick={() => onSelect(meta.id)}
            className={`group relative flex flex-col justify-between rounded-xl border-2 p-3 transition-all cursor-pointer bg-card ${
              isSelected
                ? "border-primary ring-2 ring-primary/30 shadow-md shadow-primary/10"
                : "border-border/60 hover:border-primary/50 hover:shadow-sm"
            }`}
          >
            {meta.badge && (
              <span className="absolute top-2 right-2 z-10 bg-primary/90 text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                {meta.badge}
              </span>
            )}

            {/* Miniature A4 Visual Preview */}
            <div className="relative w-full aspect-[210/297] bg-white rounded-md overflow-hidden border border-border/40 shadow-xs mb-2 flex items-center justify-center">
              <div className="absolute inset-0 origin-top-left transform scale-[0.25] w-[400%] h-[400%] pointer-events-none select-none">
                <ResumeTemplateRenderer
                  data={DEFAULT_RESUME_DATA}
                  customization={{
                    ...DEFAULT_CUSTOMIZATION,
                    templateId: meta.id,
                  }}
                />
              </div>
            </div>

            {/* Template Info */}
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                  {meta.name}
                </h4>
                {isSelected && (
                  <div className="h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Check className="h-2.5 w-2.5" />
                  </div>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight line-clamp-2">
                {meta.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
