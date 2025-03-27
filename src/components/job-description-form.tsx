"use client"

import { useState } from "react"
import { Check, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type {
  ChatProps,
  ChatResponse,
  ResponseStatus,
} from "@/types/recruitment"

interface JobDescriptionFormProps {
  onSubmit: (chatResponse: ChatProps) => Promise<void>
  className?: string
}

export function JobDescriptionForm({
  onSubmit,
  className,
}: JobDescriptionFormProps) {
  const [jobDescription, setJobDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<ResponseStatus>(null)

  const handleSubmit = async () => {
    if (!jobDescription) {
      setResponse({
        status: "error",
        message: "Please provide a job description",
      })
      return
    }

    setIsLoading(true)
    setResponse(null)

    try {
      const res = await fetch("http://localhost:3001/chat", {
        method: "POST",
        body: JSON.stringify({ message: jobDescription }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.message)

      console.log("THE RESULT: ", data)

      onSubmit({
        chatResponse: data.result,
        userMessage: jobDescription,
      })

      setResponse({
        status: "success",
        message: "Search submitted successfully!",
      })
    } catch (error) {
      console.error(error)
      setResponse({
        status: "error",
        message: `"Failed to submit search. Please try again: ${error}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <CardContent className="p-4 h-[220px] overflow-y-auto">
        <div className="mb-4">
          <label
            htmlFor="job-description"
            className="block text-sm font-medium mb-2"
          >
            What kind of employee are you looking for?
          </label>
          <textarea
            id="job-description"
            className="w-full min-h-[120px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            placeholder="Describe the ideal candidate, required skills, experience level, and any other important details..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        {response && (
          <div
            className={cn(
              "mt-4 p-3 rounded-md flex items-center gap-2",
              response.status === "success"
                ? "bg-green-500/10 text-green-600"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {response.status === "success" ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <p className="text-sm">{response.message}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleSubmit}
          disabled={!jobDescription.trim() || isLoading}
          className="w-full"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSubmit()
            }
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            "Find Candidates"
          )}
        </Button>
      </CardFooter>
    </>
  )
}
