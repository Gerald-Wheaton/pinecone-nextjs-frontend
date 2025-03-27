"use client"

import type React from "react"

import { useState, useRef } from "react"
import {
  Upload,
  Check,
  AlertCircle,
  Loader2,
  User,
  Briefcase,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export function RecruitmentTool() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isDraggingResume, setIsDraggingResume] = useState(false)
  const [isLoadingResume, setIsLoadingResume] = useState(false)
  const [resumeResponse, setResumeResponse] = useState<{
    status: "success" | "error"
    message: string
  } | null>(null)
  const resumeInputRef = useRef<HTMLInputElement>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [isLoadingJobDesc, setIsLoadingJobDesc] = useState(false)
  const [jobDescResponse, setJobDescResponse] = useState<{
    status: "success" | "error"
    message: string
  } | null>(null)
  const [activeTab, setActiveTab] = useState("upload")

  // Resume Upload Tab Functions
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
        setResumeFile(droppedFile)
        setResumeResponse(null)
      } else {
        setResumeResponse({
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
        setResumeFile(selectedFile)
        setResumeResponse(null)
      } else {
        setResumeResponse({
          status: "error",
          message: "Please upload a PDF file",
        })
      }
    }
  }

  const handleResumeSubmit = async () => {
    if (!resumeFile) {
      setResumeResponse({
        status: "error",
        message: "Please select a PDF file first",
      })
      return
    }

    setIsLoadingResume(true)
    setResumeResponse(null)

    try {
      const formData = new FormData()
      formData.append("pdf", resumeFile)

      const res = await fetch("http://localhost:3001/api/store-resume", {
        method: "POST",
        body: formData,
      })

      console.log("THE RESULT: ", res)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message)

      const af = JSON.parse(data.result)

      setResumeResponse({
        status: "success",
        message: "Resume saved successfully!",
      })

      console.log("Received employee data:", af)
    } catch (error) {
      console.error("Error uploading PDF:", error)
      setResumeResponse({
        status: "error",
        message: "Failed to upload PDF. Please try again.",
      })
    } finally {
      setIsLoadingResume(false)
    }
  }

  const openResumeSelector = () => {
    if (resumeInputRef.current) {
      resumeInputRef.current.click()
    }
  }

  const handleFindCandidates = async () => {
    if (!jobDescription) {
      setJobDescResponse({
        status: "error",
        message: "Please provide a job description",
      })
      return
    }

    setIsLoadingJobDesc(true)
    setJobDescResponse(null)

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

      setJobDescResponse({
        status: "success",
        message: "Search submitted successfully!",
      })
    } catch (error) {
      console.error(error)
      setJobDescResponse({
        status: "error",
        message: `"Failed to submit search. Please try again: ${error}`,
      })
    } finally {
      setIsLoadingJobDesc(false)
    }
  }

  return (
    <div className="flex justify-center gap-6 w-full">
      <Card className="w-full lg:w-96 p-4">
        <CardHeader>
          <CardTitle>Recruitment Tool</CardTitle>
          <CardDescription>
            Upload resumes or search for candidates
          </CardDescription>
        </CardHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Resumes</TabsTrigger>
            <TabsTrigger value="find">Find Candidates</TabsTrigger>
          </TabsList>

          <div className="h-[300px]">
            {" "}
            {/* Fixed height container for tab content */}
            <TabsContent
              value="upload"
              className="mt-0 h-full data-[state=inactive]:hidden"
            >
              <CardContent className="p-4 h-[220px] overflow-y-auto">
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors",
                    isDraggingResume
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25",
                    resumeFile ? "bg-primary/5" : "hover:bg-muted/50"
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

                  {resumeFile ? (
                    <div className="flex flex-col items-center gap-2 py-4 w-full">
                      <Check className="h-10 w-10 text-primary" />
                      <p className="font-medium text-center break-words w-full max-w-[200px]">
                        {resumeFile.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
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

                {resumeResponse && (
                  <div
                    className={cn(
                      "mt-4 p-3 rounded-md flex items-center gap-2",
                      resumeResponse.status === "success"
                        ? "bg-green-500/10 text-green-600"
                        : "bg-destructive/10 text-destructive"
                    )}
                  >
                    {resumeResponse.status === "success" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <p className="text-sm">{resumeResponse.message}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  onClick={handleResumeSubmit}
                  disabled={!resumeFile || isLoadingResume}
                  className="w-full cursor-pointer"
                >
                  {isLoadingResume ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload Resume"
                  )}
                </Button>
              </CardFooter>
            </TabsContent>
            <TabsContent
              value="find"
              className="mt-0 h-full data-[state=inactive]:hidden"
            >
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

                {jobDescResponse && (
                  <div
                    className={cn(
                      "mt-4 p-3 rounded-md flex items-center gap-2",
                      jobDescResponse.status === "success"
                        ? "bg-green-500/10 text-green-600"
                        : "bg-destructive/10 text-destructive"
                    )}
                  >
                    {jobDescResponse.status === "success" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <p className="text-sm">{jobDescResponse.message}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  onClick={handleFindCandidates}
                  disabled={!jobDescription.trim() || isLoadingJobDesc}
                  className="w-full"
                >
                  {isLoadingJobDesc ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    "Find Candidates"
                  )}
                </Button>
              </CardFooter>
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  )
}
