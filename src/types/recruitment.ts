export type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export type ResponseStatus = {
  status: "success" | "error"
  message: string
} | null

export interface ChatResponse {
  response: {
    candidates: CandidateTEST[]
    message: string
  }
  threadId: string
}

export interface ChatProps {
  userMessage: string
  chatResponse: ChatResponse
  // candidates: CandidateTEST[] | null
}

export interface Candidate {
  id: string
  first_name: string
  last_name: string
  contact_details: {
    email: string
    phone: string
  }
  job_details: {
    title: string
    experience: number
    skills: string[]
  }
  work_location: string
  performance_reviews: {
    rating: number
    comment: string
  }[]
  match_percentage: number
}

export interface CandidateTEST {
  first_name: string
  last_name: string
  contact_details: {
    email: string
    phone: string
  }
  title: string
  skills: string[]
  experience: string
  work_location?: string
  match_percentage: number
}

export interface ParsedMessage {
  message: string
  candidate?: CandidateTEST[]
}
