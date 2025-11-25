"use client"

import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp?: Date
}

interface ChatMessageProps {
  message: Message
}

// Function to convert URLs in text to clickable links
const renderMessageWithLinks = (content: string) => {
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g

  // Split content by URLs
  const parts = content.split(urlRegex)

  return parts.map((part, index) => {
    // Check if this part is a URL
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 underline font-medium transition-colors"
        >
          {part}
        </a>
      )
    }
    // Return plain text with preserved line breaks
    return part.split('\n').map((line, lineIndex) => (
      <span key={`${index}-${lineIndex}`}>
        {line}
        {lineIndex < part.split('\n').length - 1 && <br />}
      </span>
    ))
  })
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div
      className={cn(
        "flex gap-3 text-sm",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>
      <div
        className={cn(
          "flex-1 space-y-2 overflow-hidden rounded-lg px-4 py-3",
          isUser
            ? "bg-primary text-primary-foreground ml-12"
            : "bg-muted text-foreground mr-12"
        )}
      >
        <div className="whitespace-pre-wrap break-words">
          {renderMessageWithLinks(message.content)}
        </div>
        {message.timestamp && (
          <div
            className={cn(
              "text-xs opacity-70",
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