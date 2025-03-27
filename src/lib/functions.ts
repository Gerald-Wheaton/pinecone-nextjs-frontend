import { CandidateTEST, ParsedMessage } from "@/types/recruitment"

export const STORE_RESUME = async (file: File) => {}

interface ExtractedData {
  candidates: CandidateTEST[] | null
  message: string
}

function extractCandidateData(response: string): ExtractedData {
  const jsonRegex = /```json\s*([\s\S]*?)\s*```/
  const match = response.match(jsonRegex)

  if (match && match[1]) {
    try {
      const candidates = JSON.parse(match[1])
      const message = response.replace(jsonRegex, "").trim()
      return { candidates, message }
    } catch (error) {
      console.error("Failed to parse JSON:", error)
      return { candidates: null, message: response }
    }
  } else {
    console.warn("No JSON found in response.")
    return { candidates: null, message: response }
  }
}
