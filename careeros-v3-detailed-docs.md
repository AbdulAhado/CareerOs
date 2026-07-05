# CareerOS AI v3 — Comprehensive Documentation

This document serves as the complete technical and functional breakdown of the CareerOS AI v3 Ecosystem.

---

## 1. Architectural Foundation

The AI engine is entirely modular, located in `src/lib/ai/`, and is built upon four foundational pillars:

### A. Centralized Ecosystem Memory (`memory.ts`)
Instead of isolated API calls, every feature reads and writes to the `UserIntelligenceProfile`.
- **Tracks:** Target role, expected salary, technical level, communication level, confidence, ecosystem scores (ATS, Resume, Interview), identified weaknesses, and career roadmaps.
- **Impact:** Allows features to communicate. If the Resume Analyzer detects weak "Business Impact", the Interview Coach can adapt its questions to focus heavily on extracting business metrics.

### B. The 15-Persona Master Prompt (`master-system.ts`)
The AI operates as a unified council of 15 experts (FAANG Recruiter, Engineering Manager, HRBP, Behavioral Psychologist, etc.).
- **AI Quality Layer:** A strict internal checklist forces the AI to verify personalization, actionability, and recruiter-grade quality before responding, explicitly prohibiting generic AI filler.

### C. Multi-Pass Reasoning (`schemas.ts`)
We enforce Chain of Thought reasoning in a single LLM pass. Every JSON schema requires a `reasoningProcess` block:
1. **Intent Detection:** What does the user actually want?
2. **Context Analysis:** What are the constraints?
3. **Critic Review:** Is the drafted response actually good?
4. **Revision Plan:** How do we make it elite?

### D. Absolute Explainability
Every output schema requires:
- `confidenceScore` (0-100) with a detailed `reason`.
- Explanations for every single rating or feedback node (no blind scores).

---

## 2. Feature Implementation Details

### 🤖 1. Career Coach (`career-coach.ts`)
- **Philosophy:** Shift from "Answer Bot" to "L&D Strategist".
- **Capabilities:** Builds sequential, measurable roadmaps (e.g., React → Node → System Design). It monitors the `UserIntelligenceProfile` and will proactively halt job applications if ecosystem scores (like ATS Readiness) are critically low.

### 📄 2. ATS Analyzer (`ats.ts`)
- **Philosophy:** True Enterprise ATS Simulation (Workday, Greenhouse).
- **Capabilities:** 
  - **NLP Synonyms:** Maps variations (ML = Machine Learning).
  - **Graph Relationships:** Detects missing nodes in a stack (Has React/Node, missing Mongo).
  - **Logistical Filters:** Checks security clearance, visa requirements, and domain/industry matching.
  - **Absolute Scoring:** Calculates pure "Impact" and "Leadership" scores based on metrics.

### 📊 3. Resume Analyzer (`resume.ts`)
- **Philosophy:** Executive Bar Evaluation.
- **Capabilities:** Moves beyond grammar checks to score 11 elite dimensions:
  - Executive Presence
  - Business Impact
  - Ownership & Autonomy
  - Innovation
  - Decision Making
  - Mentorship
  - Technical Depth
  - Future Growth Potential

### ✍️ 4. Proposal Generator (`proposal.ts`)
- **Philosophy:** Client Psychology Decoding.
- **Capabilities:** Before writing a single word, the AI performs a psychological analysis of the Job Description to detect:
  - **Urgency:** Adjusts tone for speed (High Urgency) vs. reliability (Low Urgency).
  - **Hidden Fears:** Reassures the client based on subtle hints (e.g., emphasizing QA if they mention "pixel perfect").

### 💬 5. Interview Coach (`interview.ts`)
- **Philosophy:** Adaptive FAANG-style Interviewing.
- **Capabilities:** Reads the `previousAnswerScore` from context. 
  - If score > 85: Drastically increases difficulty (System Design, Edge Cases).
  - If score < 50: Decreases difficulty to build foundational confidence.
  - Evaluates answers and predicts the candidate's optimal "Salary Level" based on their response maturity.

---

## 3. Data Flow & Standardized Output

All AI responses pass through `runAIPipeline` (`pipeline.ts`) and are validated against `schemas.ts`. Every feature standardizes its output to ensure a premium UI experience:

```json
{
  "reasoningProcess": { ... },
  "confidenceScore": { "score": 92, "reason": "..." },
  "summary": "Executive summary...",
  "deepAnalysis": { ... },
  "priority": "High",
  "quickWins": ["Do this today"],
  "longTermPlan": ["Do this this quarter"],
  "nextSteps": ["Click here"]
}
```

This strict JSON structure allows the frontend to render beautiful, consistent, and highly trustworthy UI components for every feature.
