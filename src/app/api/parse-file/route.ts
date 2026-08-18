import { NextRequest, NextResponse } from "next/server"
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse/lib/pdf-parse.js")
import mammoth from "mammoth"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const fileName = file.name.toLowerCase()
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    let extractedText = ""

    if (fileName.endsWith(".pdf") || file.type === "application/pdf") {
      try {
        const data = await pdfParse(buffer)
        extractedText = data.text || ""
      } catch (pdfErr: any) {
        console.error("PDF parse error:", pdfErr)
        // Fallback: try reading raw utf-8 if pdf parsing fails
        extractedText = buffer.toString("utf-8").replace(/[^\x20-\x7E\s]/g, "")
      }
    } else if (
      fileName.endsWith(".docx") ||
      fileName.endsWith(".doc") ||
      file.type.includes("wordprocessingml") ||
      file.type.includes("msword")
    ) {
      try {
        const result = await mammoth.extractRawText({ buffer })
        extractedText = result.value || ""
      } catch (docErr: any) {
        console.error("DOCX parse error:", docErr)
        extractedText = buffer.toString("utf-8").replace(/[^\x20-\x7E\s]/g, "")
      }
    } else {
      // Default plain text (.txt, etc.)
      extractedText = buffer.toString("utf-8")
    }

    // Clean up extracted text: normalize line breaks, remove null bytes
    extractedText = extractedText
      .replace(/\0/g, "")
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim()

    if (!extractedText) {
      return NextResponse.json(
        { error: "Could not extract readable text from the file. Please copy and paste your resume text manually." },
        { status: 422 }
      )
    }

    return NextResponse.json({ text: extractedText, fileName: file.name })
  } catch (error: any) {
    console.error("File parse route error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to process file" },
      { status: 500 }
    )
  }
}
