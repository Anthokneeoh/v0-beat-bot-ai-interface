"use client"

import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp?: Date
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div
      className={cn(
        "flex gap-2 sm:gap-3 text-xs sm:text-sm",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 select-none items-center justify-center rounded-full",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        )}
      >
        {isUser ? (
          <User className="h-3 w-3 sm:h-4 sm:w-4" />
        ) : (
          <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
        )}
      </div>
      <div
        className={cn(
          "flex-1 space-y-2 overflow-hidden rounded-lg px-3 py-2 sm:px-4 sm:py-3",
          isUser
            ? "bg-primary text-primary-foreground ml-8 sm:ml-12"
            : "bg-muted text-foreground mr-8 sm:mr-12"
        )}
      >
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {isUser ? (
            <div className="whitespace-pre-wrap break-words text-xs sm:text-sm">{message.content}</div>
          ) : (
            <ReactMarkdown
              components={{
                a: ({ node, children, href, ...props }) => (
                  <a
                    {...props}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 underline font-semibold transition-colors inline-block my-1 break-all text-xs sm:text-sm"
                  >
                    {children}
                  </a>
                ),
                h1: ({ node, ...props }) => (
                  <h1 {...props} className="text-base sm:text-xl font-bold mt-3 mb-2 sm:mt-4 sm:mb-3" />
                ),
                h2: ({ node, ...props }) => (
                  <h2 {...props} className="text-sm sm:text-lg font-bold mt-3 mb-2 sm:mt-4 sm:mb-3" />
                ),
                h3: ({ node, ...props }) => (
                  <h3 {...props} className="text-xs sm:text-base font-bold mt-2 mb-1 sm:mt-3 sm:mb-2" />
                ),
                p: ({ node, children, ...props }) => {
                  const content = String(children)

                  if (content.includes('Why:')) {
                    return (
                      <p {...props} className="my-2 sm:my-3 leading-relaxed pl-2 sm:pl-4 border-l-2 border-primary/30 text-xs sm:text-sm">
                        {children}
                      </p>
                    )
                  }

                  return (
                    <p {...props} className="my-1.5 sm:my-2 leading-relaxed text-xs sm:text-sm">
                      {children}
                    </p>
                  )
                },
                strong: ({ node, ...props }) => (
                  <strong {...props} className="font-bold text-foreground" />
                ),
                ul: ({ node, ...props }) => (
                  <ul {...props} className="list-disc list-inside my-2 sm:my-3 space-y-1.5 sm:space-y-2" />
                ),
                ol: ({ node, ...props }) => (
                  <ol {...props} className="list-decimal list-inside my-2 sm:my-3 space-y-2 sm:space-y-3" />
                ),
                li: ({ node, ...props }) => (
                  <li {...props} className="my-1.5 sm:my-2 leading-relaxed text-xs sm:text-sm" />
                ),
                hr: ({ node, ...props }) => (
                  <hr {...props} className="my-3 sm:my-4 border-border" />
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
        {message.timestamp && (
          <div
            className={cn(
              "text-[10px] sm:text-xs opacity-70 mt-1 sm:mt-2",
              isUser ? "text-primary-foreground" : "text-muted-foreground"
            )}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// 2. UPDATE: components/chat-area.tsx
// ============================================
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

// ============================================
// 3. UPDATE: components/chat-input.tsx
// ============================================
"use client"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
    }
  }, [message])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="border-t border-border bg-background p-2 sm:p-4">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask BeatBot for music recommendations..."
              disabled={disabled}
              rows={1}
              className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 max-h-32 overflow-y-auto"
            />
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={!message.trim() || disabled}
            className="shrink-0 h-9 w-9 sm:h-10 sm:w-10"
          >
            <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>
    </div>
  )
}

// ============================================
// 4. UPDATE: components/sidebar.tsx (if exists)
// ============================================
"use client"

import { X, Music2, History, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 sm:w-72 border-r border-border bg-card transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Music2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <span className="font-bold text-sm sm:text-base">BeatBot</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-2 sm:p-4">
            <div className="space-y-1 sm:space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 sm:gap-3 text-xs sm:text-sm h-9 sm:h-10"
              >
                <History className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Chat History
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 sm:gap-3 text-xs sm:text-sm h-9 sm:h-10"
              >
                <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Settings
              </Button>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-3 sm:p-4 border-t border-border">
            <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
              Powered by AI
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}