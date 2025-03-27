"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Message, ChatResponse, ChatProps } from "@/types/recruitment"

interface FormatMessageProps {
  message: string
  role: "user" | "assistant"
  threadId?: string
}

const formatMessage = ({ message, role, threadId }: FormatMessageProps) => {
  const formattedMessage: Message = {
    id:
      role === "assistant"
        ? `${threadId}_${Date.now().toString()}`
        : Date.now().toString(),
    content: message,
    role: role,
    timestamp: new Date(),
  }

  return formattedMessage
}

function formatTime(dateString: string) {
  const date = new Date(dateString)
  let hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? "pm" : "am"

  hours = hours % 12
  hours = hours ? hours : 12

  const formattedMinutes = minutes.toString().padStart(2, "0")

  return `${hours}:${formattedMinutes}${ampm}`
}

interface ChatInterfaceProps {
  chat: ChatProps | undefined
  onReset: () => void
}

export function ChatInterface({ chat, onReset }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [tId, setTId] = useState<string | undefined>(undefined)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // setting initial chat messages
    if (chat?.userMessage && messages.length === 0) {
      console.log(
        "Initiating the message thread with threadID: ",
        chat.chatResponse.threadId
      )

      setIsTyping(true)
      const userMessage: Message = formatMessage({
        message: chat.userMessage,
        role: "user",
      })

      setMessages([userMessage])
      setTId(chat.chatResponse.threadId)

      const aiResponse: Message = formatMessage({
        message: chat.chatResponse.response.message,
        role: "assistant",
        threadId: chat.chatResponse.threadId,
      })

      setIsTyping(false)
      setMessages((prev) => [...prev, aiResponse])
    }
  }, [chat])

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus chat input when component mounts
  useEffect(() => {
    chatInputRef.current?.focus()
  }, [])

  const sendMessage = async (message: string) => {
    try {
      const res = await fetch(`http://localhost:3001/chat/${tId}`, {
        method: "POST",
        body: JSON.stringify({ message: message }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.message)

      console.log(`THE BOT RESPONSE to threadId: ${tId}: `, data)
      setMessages((prev) => [
        ...prev,
        formatMessage({
          message: data.response,
          role: "assistant",
          threadId: tId,
        }),
      ])
    } catch (error) {
      console.error(error)
    } finally {
      setIsTyping(false)
    }
  }

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return
    setIsTyping(true)

    const newMessage = currentMessage
    setCurrentMessage("")

    setMessages((prev) => [
      ...prev,
      formatMessage({ message: newMessage, role: "user" }),
    ])
    sendMessage(newMessage)
  }

  return (
    <CardContent className="p-4 h-[420px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">AI Recruitment Assistant</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
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
                message.role === "user" ? "justify-end" : "justify-start"
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
                    {formatTime(message.timestamp.toString())}
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
            if (e.key === "Enter" && !e.shiftKey && !isTyping) {
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
  )
}
