"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { ChatArea } from "./chat-area"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Message } from "./chat-message"

export function BeatBotChat() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (message: string) => {
    // 1. Create the User's message object
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
    }

    // 2. Add User message to the chat immediately (Optimistic UI)
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      // 3. Call your Next.js Backend (which talks to Poe)
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      })

      const data = await res.json()

      // 4. Handle both success and API-level errors (like quota exceeded)
      if (res.ok && data.response) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
        }
        setMessages((prev) => [...prev, aiMessage])
      } else {
        throw new Error(data.error || "Failed to fetch response")
      }

    } catch (error) {
      console.error("Chat error:", error)

      // 5. If it fails, show the error in the chat bubble
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "⚠️ **Connection Error:** I'm having trouble connecting to the BeatBot Brain (Poe). Please check your internet connection or API configuration.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden text-foreground hover:bg-secondary"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Chat Area Component */}
      <ChatArea
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  )
}