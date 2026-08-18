"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ResumeData, CustomizationSettings, TemplateId, FontStyle, SpacingLevel, MarginLevel } from "@/components/resume-builder/types"
import { DEFAULT_RESUME_DATA, DEFAULT_CUSTOMIZATION } from "@/components/resume-builder/default-data"
import { ResumeTemplateRenderer } from "@/components/resume-builder/templates"
import { TemplateGallery } from "@/components/resume-builder/template-thumbnails"
import { EditorForms } from "@/components/resume-builder/editor-forms"
import { exportToPDF, exportToDOCX, exportToHTML } from "@/components/resume-builder/export-utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Save,
  FileSpreadsheet,
  FileCode,
  Printer,
  Check,
  Eye,
  Edit3,
  Palette,
  LayoutTemplate,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Copy,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
  Type,
  AlignVerticalSpaceAround,
  Columns3,
} from "lucide-react"

const COLOR_PRESETS = [
  { id: "red", hex: "#dc2626", name: "Crimson Red" },
  { id: "blue", hex: "#2563eb", name: "Royal Blue" },
  { id: "green", hex: "#059669", name: "Emerald Green" },
  { id: "purple", hex: "#7c3aed", name: "Violet Purple" },
  { id: "slate", hex: "#475569", name: "Slate Dark" },
  { id: "orange", hex: "#d97706", name: "Amber Orange" },
  { id: "black", hex: "#18181b", name: "Onyx Black" },
]

const FONT_PRESETS: { id: FontStyle; name: string }[] = [
  { id: "sans", name: "Modern Sans" },
  { id: "serif", name: "Classic Serif" },
  { id: "clean", name: "Clean Sans" },
  { id: "tech", name: "Technical" },
]

export default function ResumeBuilderPage() {
  const [resumeData, setResumeData] = useState<ResumeData>(DEFAULT_RESUME_DATA)
  const [customization, setCustomization] = useState<CustomizationSettings>(DEFAULT_CUSTOMIZATION)
  const [viewMode, setViewMode] = useState<"editor" | "preview">("editor")
  const [zoomLevel, setZoomLevel] = useState<number>(70)
  const [lastSavedTime, setLastSavedTime] = useState<string>("Just now")
  const [savedNotice, setSavedNotice] = useState(false)
  const [showGallery, setShowGallery] = useState(false)
  const [showCustomization, setShowCustomization] = useState(false)
  const [aiLoadingKey, setAiLoadingKey] = useState<string | null>(null)
  const [pageCount, setPageCount] = useState<number>(1)
  const [mounted, setMounted] = useState(false)

  const previewRef = useRef<HTMLDivElement>(null)

  // Mount animation
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("careeros_resume_data_v2")
      const savedCustom = localStorage.getItem("careeros_resume_custom_v2")
      if (savedData) setResumeData(JSON.parse(savedData))
      if (savedCustom) setCustomization(JSON.parse(savedCustom))
    } catch (e) {
      console.error("Failed to load saved resume draft", e)
    }
  }, [])

  // Auto-save debounced
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem("careeros_resume_data_v2", JSON.stringify(resumeData))
        localStorage.setItem("careeros_resume_custom_v2", JSON.stringify(customization))
        setLastSavedTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
      } catch (e) {
        console.error("Auto-save error", e)
      }
    }, 800)
    return () => clearTimeout(timer)
  }, [resumeData, customization])

  // Page count detection
  useEffect(() => {
    if (previewRef.current) {
      const h = previewRef.current.scrollHeight
      setPageCount(h > 1150 ? 2 : 1)
    }
  }, [resumeData, customization, viewMode])

  const handleManualSave = useCallback(() => {
    localStorage.setItem("careeros_resume_data_v2", JSON.stringify(resumeData))
    localStorage.setItem("careeros_resume_custom_v2", JSON.stringify(customization))
    setSavedNotice(true)
    setTimeout(() => setSavedNotice(false), 2500)
  }, [resumeData, customization])

  const handleDuplicateResume = () => {
    setResumeData({ ...resumeData, title: `${resumeData.title} (Copy)` })
    handleManualSave()
  }

  // AI handler
  const handleAIOperation = async (action: string, contextText: string, targetKey: string, itemId?: string) => {
    const loadingKey = itemId ? `exp-${itemId}` : `${targetKey}-${action}`
    setAiLoadingKey(loadingKey)
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `Improve the user's resume content without inventing facts. Never fabricate employers, job titles, years, technologies, certifications, achievements, statistics, revenue, or percentages. Only rewrite or reorganize the information explicitly provided by the user. Instruction: ${action}`,
            },
            { role: "user", content: `Rewrite the following text:\n\n${contextText}` },
          ],
        }),
      })
      if (res.ok) {
        const result = await res.json()
        if (result.reply) {
          const cleanReply = result.reply.replace(/```/g, "").trim()
          if (targetKey === "summary") {
            setResumeData((prev) => ({ ...prev, summary: cleanReply }))
          } else if (targetKey === "experience" && itemId) {
            setResumeData((prev) => ({
              ...prev,
              experience: prev.experience.map((item) => (item.id === itemId ? { ...item, description: cleanReply } : item)),
            }))
          }
        }
      }
    } catch (err) {
      console.error("AI Assistant error:", err)
    } finally {
      setAiLoadingKey(null)
    }
  }

  // Exports
  const handlePDF = () => {
    if (previewRef.current) exportToPDF(previewRef.current.innerHTML, customization)
  }
  const handleDOCX = () => exportToDOCX(resumeData, customization)
  const handleHTML = () => {
    if (previewRef.current) exportToHTML(previewRef.current.innerHTML, customization, resumeData.personal.fullName || "Resume")
  }

  return (
    <div
      className={`flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-700 ease-out ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* ═══════════════════ STICKY TOP BAR ═══════════════════ */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border/40 px-5 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 max-w-[1800px] mx-auto">
          {/* Left: Title + Status */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-primary/10 shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <Input
                value={resumeData.title}
                onChange={(e) => setResumeData({ ...resumeData, title: e.target.value })}
                className="text-lg font-bold tracking-tight bg-transparent border-transparent hover:border-border/60 focus:border-primary h-8 px-1.5 w-full max-w-sm transition-all duration-200"
              />
              <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground mt-0.5 pl-1.5">
                <span className="flex items-center gap-1 text-emerald-500 font-medium animate-pulse">
                  <Check className="h-3 w-3" /> Auto-saved
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {lastSavedTime}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Export Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleManualSave}
              className="h-8 gap-1.5 text-xs font-medium hover:bg-muted/60 transition-all duration-200"
            >
              {savedNotice ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Save className="h-3.5 w-3.5" />}
              {savedNotice ? "Saved!" : "Save"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDuplicateResume}
              className="h-8 gap-1.5 text-xs font-medium hover:bg-muted/60 transition-all duration-200"
            >
              <Copy className="h-3.5 w-3.5 text-purple-400" /> Duplicate
            </Button>

            <div className="h-4 w-px bg-border/60 mx-1" />

            <Button
              variant="outline"
              size="sm"
              onClick={handleDOCX}
              className="h-8 gap-1.5 text-xs font-medium border-border/50 hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-400 transition-all duration-200"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" /> .docx
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleHTML}
              className="h-8 gap-1.5 text-xs font-medium border-border/50 hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-400 transition-all duration-200"
            >
              <FileCode className="h-3.5 w-3.5" /> .html
            </Button>
            <Button
              size="sm"
              onClick={handlePDF}
              className="h-8 gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 text-xs font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary/30"
            >
              <Printer className="h-3.5 w-3.5" /> Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* ═══════════════════ CONTROLS STRIP ═══════════════════ */}
      <div className="border-b border-border/30 bg-card/50 px-5 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3 max-w-[1800px] mx-auto">
          {/* Left: Mode + Panels */}
          <div className="flex items-center gap-2">
            {/* Mode Tabs */}
            <div className="flex items-center bg-muted/50 rounded-lg p-0.5 border border-border/40">
              <button
                onClick={() => setViewMode("editor")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
                  viewMode === "editor"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Edit3 className="h-3.5 w-3.5" /> Editor
              </button>
              <button
                onClick={() => setViewMode("preview")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
                  viewMode === "preview"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye className="h-3.5 w-3.5" /> Preview
              </button>
            </div>

            <div className="h-5 w-px bg-border/40 mx-1" />

            {/* Gallery Toggle */}
            <button
              onClick={() => setShowGallery(!showGallery)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-300 ${
                showGallery
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border/40 text-muted-foreground hover:text-foreground hover:border-border/60"
              }`}
            >
              <LayoutTemplate className="h-3.5 w-3.5" /> Templates
            </button>

            {/* Customization Toggle */}
            <button
              onClick={() => setShowCustomization(!showCustomization)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-300 ${
                showCustomization
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border/40 text-muted-foreground hover:text-foreground hover:border-border/60"
              }`}
            >
              <Palette className="h-3.5 w-3.5" /> Customize
            </button>
          </div>

          {/* Right: Page + Zoom */}
          <div className="flex items-center gap-2.5">
            {pageCount > 1 && (
              <span className="text-[11px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-md flex items-center gap-1 animate-pulse">
                <AlertTriangle className="h-3 w-3" /> {pageCount} pages
              </span>
            )}

            <Badge variant="outline" className="text-[11px] font-medium px-2 py-0.5 border-border/40">
              {pageCount} {pageCount > 1 ? "pages" : "page"}
            </Badge>

            <div className="flex items-center gap-0.5 bg-muted/40 border border-border/40 rounded-lg p-0.5">
              <button
                onClick={() => setZoomLevel(Math.max(40, zoomLevel - 10))}
                className="p-1.5 rounded hover:bg-background/80 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="text-[11px] font-semibold px-1.5 w-10 text-center tabular-nums">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
                className="p-1.5 rounded hover:bg-background/80 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(70)}
                className="p-1.5 rounded hover:bg-background/80 text-muted-foreground hover:text-foreground transition-colors"
                title="Fit"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════ COLLAPSIBLE PANELS ═══════════════════ */}

      {/* Template Gallery Panel */}
      <div
        className={`overflow-hidden border-b border-border/30 transition-all duration-500 ease-in-out ${
          showGallery ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 py-4 bg-card/30 max-w-[1800px] mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <LayoutTemplate className="h-4 w-4 text-primary" /> Template Gallery
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Choose a layout. Your data stays intact when switching.</p>
            </div>
            <button onClick={() => setShowGallery(false)} className="text-muted-foreground hover:text-foreground transition-colors">
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>
          <TemplateGallery
            selectedId={customization.templateId}
            onSelect={(id: TemplateId) => setCustomization({ ...customization, templateId: id })}
          />
        </div>
      </div>

      {/* Customization Panel */}
      <div
        className={`overflow-hidden border-b border-border/30 transition-all duration-500 ease-in-out ${
          showCustomization ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 py-4 bg-card/30 max-w-[1800px] mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" /> Customization
            </h3>
            <button onClick={() => setShowCustomization(false)} className="text-muted-foreground hover:text-foreground transition-colors">
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Color */}
            <div>
              <label className="text-[11px] font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                <Palette className="h-3 w-3" /> Accent Color
              </label>
              <div className="flex items-center gap-2 mt-1.5">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCustomization({ ...customization, accentColor: c.hex })}
                    className={`h-6 w-6 rounded-full transition-all duration-300 hover:scale-125 ${
                      customization.accentColor === c.hex
                        ? "ring-2 ring-foreground/60 ring-offset-2 ring-offset-background scale-110"
                        : "hover:ring-1 hover:ring-foreground/20"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
                <input
                  type="color"
                  value={customization.accentColor}
                  onChange={(e) => setCustomization({ ...customization, accentColor: e.target.value })}
                  className="h-6 w-6 rounded cursor-pointer border-0 bg-transparent p-0"
                  title="Custom"
                />
              </div>
            </div>

            {/* Font */}
            <div>
              <label className="text-[11px] font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                <Type className="h-3 w-3" /> Typography
              </label>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {FONT_PRESETS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setCustomization({ ...customization, fontStyle: f.id })}
                    className={`text-[10px] px-2 py-1 rounded-md border transition-all duration-200 ${
                      customization.fontStyle === f.id
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-border/40 text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Spacing */}
            <div>
              <label className="text-[11px] font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                <AlignVerticalSpaceAround className="h-3 w-3" /> Spacing
              </label>
              <div className="flex gap-1 mt-1.5">
                {(["compact", "normal", "spacious"] as SpacingLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setCustomization({ ...customization, spacing: lvl })}
                    className={`text-[10px] px-2 py-1 rounded-md border capitalize transition-all duration-200 flex-1 ${
                      customization.spacing === lvl
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-border/40 text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Margins */}
            <div>
              <label className="text-[11px] font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                <Columns3 className="h-3 w-3" /> Margins
              </label>
              <div className="flex gap-1 mt-1.5">
                {(["compact", "normal", "wide"] as MarginLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setCustomization({ ...customization, margins: lvl })}
                    className={`text-[10px] px-2 py-1 rounded-md border capitalize transition-all duration-200 flex-1 ${
                      customization.margins === lvl
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-border/40 text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════ MAIN WORKSPACE ═══════════════════ */}
      <div className="flex-1 overflow-hidden">
        {viewMode === "editor" ? (
          <div className="flex h-full">
            {/* LEFT: Editor Forms (scrollable) */}
            <div className="w-full lg:w-[420px] xl:w-[480px] shrink-0 border-r border-border/30 overflow-y-auto p-4">
              <EditorForms
                data={resumeData}
                onChange={setResumeData}
                onAIOperation={handleAIOperation}
                aiLoadingKey={aiLoadingKey}
              />
            </div>

            {/* RIGHT: Live A4 Preview (fills remaining space) */}
            <div className="hidden lg:flex flex-1 items-start justify-center overflow-auto bg-[#0a0a0c] p-6">
              <div
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: "top center",
                  transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <div
                  ref={previewRef}
                  className="w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-2xl shadow-black/50 rounded-sm overflow-hidden transition-shadow duration-500"
                  style={{
                    boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05)",
                  }}
                >
                  <ResumeTemplateRenderer data={resumeData} customization={customization} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Full-Screen A4 Preview Mode */
          <div className="flex-1 flex items-start justify-center overflow-auto bg-[#0a0a0c] p-8">
            <div
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: "top center",
                transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <div
                ref={previewRef}
                className="w-[210mm] min-h-[297mm] bg-white text-slate-900 rounded-sm overflow-hidden"
                style={{
                  boxShadow: "0 30px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.05)",
                }}
              >
                <ResumeTemplateRenderer data={resumeData} customization={customization} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
