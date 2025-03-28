"use client"

import { useEffect, useState } from "react"
import AIChat from "@/components/ai-chat"

interface TempChatResponse {
  response: string
  threadId: string
}

export default function ChatPage() {
  const [isError, setIsError] = useState(false)
  const [tId, setTId] = useState()

  // Function to send message to backend AI agent
  const sendMessageToAI = async (message: string): Promise<string> => {
    try {
      setIsError(false)

      // In a real application, this would be an API call to your backend
      // For demonstration, we'll simulate a response

      // Simulate network delay
      console.log(
        `sending request to http://localhost:3001/chat${tId ? `/${tId}` : ""}`
      )
      const res = await fetch(
        `http://localhost:3001/chat${tId ? `/${tId}` : ""}`,
        {
          method: "POST",
          body: JSON.stringify({ message: message }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data?.message)

      console.log(data)

      tId ?? setTId(data.result.threadId)

      return data.result.response
    } catch (error) {
      setIsError(true)
      throw error
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">AI Chat Assistant</h1>

      <AIChat
        title="AI Chat"
        description="Chat with your AI assistant"
        onSendMessage={sendMessageToAI}
      />

      {isError && (
        <div className="mt-4 text-red-500">
          There was an error communicating with the AI. Please try again.
        </div>
      )}
    </main>
  )
}
