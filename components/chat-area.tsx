"use client"

import { useState, useRef, useEffect } from "react"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { TypingIndicator } from "./typing-indicator"
import { Headphones, Sparkles } from "lucide-react"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: "1",
    content:
      "Hey there! I'm BeatBot, your AI-powered Spotify recommendations assistant. I can help you discover new music, create playlists, find similar artists, or just chat about your favorite tunes. What kind of music are you in the mood for today?",
    role: "assistant",
    timestamp: new Date(),
  },
]

const suggestedPrompts = [
  "Recommend songs like Daft Punk",
  "Create a workout playlist",
  "What's trending in hip-hop?",
  "Help me find chill study music",
]

export function ChatArea() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: content }),
      })

      const data = await res.json()

      if (res.ok && data.response) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          role: "assistant",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
      } else {
        throw new Error(data.error || "Failed to get response")
      }
    } catch (error) {
      console.error("Chat error:", error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "⚠️ **Connection Error:** I'm having trouble connecting to the BeatBot Brain (Poe). Please check your internet connection or API configuration.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt)
  }

  return (
    <main className="flex-1 flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 sm:gap-3 ml-10 sm:ml-12 lg:ml-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center">
            <Headphones className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-foreground text-sm sm:text-base">BeatBot AI</h2>
            <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">AI-powered Spotify recommendations</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">AI Powered</span>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-3 sm:py-6 space-y-4 sm:space-y-6">
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested prompts */}
      {messages.length <= 1 && (
        <div className="px-2 sm:px-4 pb-2 sm:pb-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 sm:mb-3 text-center">Try asking:</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptClick(prompt)}
                  className="px-2.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-sm rounded-full bg-secondary hover:bg-primary/20 hover:text-primary text-secondary-foreground transition-colors border border-border/50 hover:border-primary/30"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </main>
  )
}