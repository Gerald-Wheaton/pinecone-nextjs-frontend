"use client"

import { useState } from "react"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { ResumeUpload } from "@/components/resume-upload"
import { JobDescriptionForm } from "./job-description-form"
import { ChatInterface } from "./chat-interface"
import { CandidateTEST, ChatProps } from "@/types/recruitment"

interface RecruitmentToolProps {
  onJobDescriptionSubmit?: (jobDescription: CandidateTEST[]) => void
}

export function RecruitmentTool({
  onJobDescriptionSubmit,
}: RecruitmentToolProps) {
  const [activeTab, setActiveTab] = useState("upload")
  const [jobDescSubmitted, setJobDescSubmitted] = useState(false)
  const [chatProps, setChatProps] = useState<ChatProps | undefined>(undefined)
  const [cardExpanded, setCardExpanded] = useState(false)

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setCardExpanded(value === "find" && jobDescSubmitted)
  }

  // Handle job description submission
  const handleJobDescriptionSubmit = async (chat: ChatProps) => {
    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("THE DATAtatata: ", chat.chatResponse)

    setChatProps(chat)
    setJobDescSubmitted(true)
    setCardExpanded(true)

    if (onJobDescriptionSubmit) {
      onJobDescriptionSubmit(chat.chatResponse.response.candidates)
    }
  }

  // Reset chat
  const resetChat = () => {
    setJobDescSubmitted(false)
    setChatProps(undefined)
    setCardExpanded(false)
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
              <ResumeUpload />
            </TabsContent>

            <TabsContent
              value="find"
              className="mt-0 h-full data-[state=inactive]:hidden"
            >
              {!jobDescSubmitted ? (
                <JobDescriptionForm onSubmit={handleJobDescriptionSubmit} />
              ) : (
                <ChatInterface chat={chatProps} onReset={resetChat} />
              )}
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  )
}
