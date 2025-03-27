"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Upload,
  Check,
  AlertCircle,
  Loader2,
  Send,
  Bot,
  User,
  RefreshCw,
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

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export function RecruitmentBot() {
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
  const [jobDescSubmitted, setJobDescSubmitted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)

  // Animation state
  const [cardExpanded, setCardExpanded] = useState(false)

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setCardExpanded(value === "find" && jobDescSubmitted)
  }

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus chat input when chat is shown
  useEffect(() => {
    if (jobDescSubmitted && activeTab === "find") {
      chatInputRef.current?.focus()
    }
  }, [jobDescSubmitted, activeTab])

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
      // Create FormData to send the file
      const formData = new FormData()
      formData.append("resume", resumeFile)

      // In a real application, you would send this to your API
      // This is a simulated API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate successful response
      setResumeResponse({
        status: "success",
        message: "Resume uploaded successfully!",
      })
    } catch (error) {
      setResumeResponse({
        status: "error",
        message: "Failed to upload resume. Please try again.",
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
    if (!jobDescription.trim()) {
      setJobDescResponse({
        status: "error",
        message: "Please provide a job description",
      })
      return
    }

    setIsLoadingJobDesc(true)
    setJobDescResponse(null)

    try {
      // Create FormData to send the data
      const formData = new FormData()
      formData.append("jobDescriptionText", jobDescription)

      // In a real application, you would send this to your API
      // This is a simulated API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Initialize chat with job description
      const initialUserMessage: Message = {
        id: Date.now().toString(),
        content: jobDescription,
        role: "user",
        timestamp: new Date(),
      }

      // Simulate successful response and transition to chat
      setJobDescSubmitted(true)
      setCardExpanded(true)
      setMessages([initialUserMessage])

      // Simulate AI response
      setIsTyping(true)
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: `I've analyzed your job description and I'm ready to help you find the perfect candidate. Could you tell me more about the specific skills or experience that are most important for this role?`,
          role: "assistant",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiResponse])
        setIsTyping(false)
      }, 2000)
    } catch (error) {
      setJobDescResponse({
        status: "error",
        message: "Failed to submit search. Please try again.",
      })
    } finally {
      setIsLoadingJobDesc(false)
    }
  }

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setCurrentMessage("")

    // Simulate AI typing
    setIsTyping(true)

    // Simulate AI response after delay
    setTimeout(() => {
      const aiResponses = [
        "Based on your requirements, I've found several candidates with matching skills. Would you like me to prioritize experience level or specific technical skills?",
        "I've identified some promising profiles that match your criteria. Should I focus on candidates with leadership experience or those with more hands-on technical backgrounds?",
        "There are several candidates in our database who might be a good fit. Would you prefer someone who can start immediately or are you willing to wait for the right candidate?",
        "I've analyzed the job market and found some potential matches. Would you like me to provide more detailed profiles of the top 3 candidates?",
        "Based on your description, I think we should focus on candidates with strong problem-solving abilities. Would you agree, or is there another quality you value more?",
      ]

      const randomResponse =
        aiResponses[Math.floor(Math.random() * aiResponses.length)]

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500 + Math.random() * 1000)
  }

  const resetChat = () => {
    setJobDescSubmitted(false)
    setMessages([])
    setJobDescription("")
    setCardExpanded(false)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex justify-center gap-6 w-full">
      <Card
        className={cn(
          "p-4 transition-all duration-500 ease-in-out",
          cardExpanded ? "w-full lg:w-[700px]" : "w-full lg:w-96"
        )}
      >
        <CardHeader>
          <CardTitle>Recruitment Tool</CardTitle>
          <CardDescription>
            Upload resumes or search for candidates
          </CardDescription>
        </CardHeader>
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Resumes</TabsTrigger>
            <TabsTrigger value="find">Find Candidates</TabsTrigger>
          </TabsList>

          <div
            className={cn(
              "transition-all duration-500 ease-in-out",
              cardExpanded ? "h-[500px]" : "h-[300px]"
            )}
          >
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
                  className="w-full"
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
              {!jobDescSubmitted ? (
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
                </>
              ) : (
                <>
                  <CardContent className="p-4 h-[420px] flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-medium">
                        AI Recruitment Assistant
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetChat}
                        className="h-8 px-2"
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        New Search
                      </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto mb-4 pr-2">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={cn(
                              "flex",
                              message.role === "user"
                                ? "justify-end"
                                : "justify-start"
                            )}
                          >
                            <div
                              className={cn(
                                "max-w-[80%] rounded-lg p-3 flex items-start gap-2",
                                message.role === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              )}
                            >
                              {message.role === "assistant" && (
                                <Bot className="h-5 w-5 mt-0.5 shrink-0" />
                              )}
                              <div className="flex flex-col">
                                <p className="text-sm">{message.content}</p>
                                <span className="text-xs opacity-70 mt-1 self-end">
                                  {formatTime(message.timestamp)}
                                </span>
                              </div>
                              {message.role === "user" && (
                                <User className="h-5 w-5 mt-0.5 shrink-0" />
                              )}
                            </div>
                          </div>
                        ))}

                        {isTyping && (
                          <div className="flex justify-start">
                            <div className="max-w-[80%] rounded-lg p-3 bg-muted flex items-center gap-2">
                              <Bot className="h-5 w-5 shrink-0" />
                              <div className="flex space-x-1">
                                <div
                                  className="h-2 w-2 rounded-full bg-current animate-bounce"
                                  style={{ animationDelay: "0ms" }}
                                ></div>
                                <div
                                  className="h-2 w-2 rounded-full bg-current animate-bounce"
                                  style={{ animationDelay: "150ms" }}
                                ></div>
                                <div
                                  className="h-2 w-2 rounded-full bg-current animate-bounce"
                                  style={{ animationDelay: "300ms" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        ref={chatInputRef}
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                      />
                      <Button
                        size="icon"
                        onClick={handleSendMessage}
                        disabled={!currentMessage.trim() || isTyping}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  )
}
