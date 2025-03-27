"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Check, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ResponseStatus } from "@/types/recruitment"

interface ResumeUploadProps {
  className?: string
}

export function ResumeUpload({ className }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDraggingResume, setIsDraggingResume] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<ResponseStatus>(null)
  const resumeInputRef = useRef<HTMLInputElement>(null)

  const handleResumeDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDraggingResume(true)
  }

  const handleResumeDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDraggingResume(false)
  }

  const handleResumeDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDraggingResume(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile)
        setResponse(null)
      } else {
        setResponse({
          status: "error",
          message: "Please upload a PDF file",
        })
      }
    }
  }

  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile)
        setResponse(null)
      } else {
        setResponse({
          status: "error",
          message: "Please upload a PDF file",
        })
      }
    }
  }

  const handleResumeSubmit = async () => {
    if (!file) {
      setResponse({
        status: "error",
        message: "Please select a PDF file first",
      })
      return
    }

    setIsLoading(true)
    setResponse(null)

    try {
      const formData = new FormData()
      formData.append("pdf", file)

      const res = await fetch("http://localhost:3001/api/store-resume", {
        method: "POST",
        body: formData,
      })

      console.log("THE RESULT: ", res)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message)

      const af = JSON.parse(data.result)

      setResponse({
        status: "success",
        message: "Resume saved successfully!",
      })

      console.log("Received employee data:", af)
    } catch (error) {
      console.error("Error uploading PDF:", error)
      setResponse({
        status: "error",
        message: "Failed to upload PDF. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openResumeSelector = () => {
    if (resumeInputRef.current) {
      resumeInputRef.current.click()
    }
  }

  return (
    <>
      <CardContent className="p-4 h-[220px] overflow-y-auto">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors",
            isDraggingResume
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25",
            file ? "bg-primary/5" : "hover:bg-muted/50"
          )}
          onDragOver={handleResumeDragOver}
          onDragLeave={handleResumeDragLeave}
          onDrop={handleResumeDrop}
          onClick={openResumeSelector}
        >
          <input
            type="file"
            ref={resumeInputRef}
            onChange={handleResumeFileChange}
            accept="application/pdf"
            className="hidden"
          />

          {file ? (
            <div className="flex flex-col items-center gap-2 py-4 w-full">
              <Check className="h-10 w-10 text-primary" />
              <p className="font-medium text-center break-words w-full max-w-[200px]">
                {file.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-4">
              <Upload className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-2">
                Drop resume PDFs here or click to browse
              </p>
            </div>
          )}
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
          onClick={handleResumeSubmit}
          disabled={!file || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload Resume"
          )}
        </Button>
      </CardFooter>
    </>
  )
}
