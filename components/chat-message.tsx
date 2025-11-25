"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Headphones, User } from "lucide-react"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div
      className={cn(
        "flex gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      <Avatar className={cn("h-8 w-8 shrink-0", isUser ? "ring-2 ring-muted" : "ring-2 ring-primary/30")}>
        <AvatarFallback
          className={cn(isUser ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground")}
        >
          {isUser ? <User className="h-4 w-4" /> : <Headphones className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-card border border-border text-card-foreground rounded-bl-md",
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <p className={cn("text-[10px] mt-2 opacity-60", isUser ? "text-right" : "text-left")}>
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  )
}
"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Headphones, User } from "lucide-react"
import ReactMarkdown from 'react-markdown'

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div
      className={cn(
        "flex gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      <Avatar className={cn("h-8 w-8 shrink-0", isUser ? "ring-2 ring-muted" : "ring-2 ring-primary/30")}>
        <AvatarFallback
          className={cn(isUser ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground")}
        >
          {isUser ? <User className="h-4 w-4" /> : <Headphones className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-card border border-border text-card-foreground rounded-bl-md",
        )}
      >
        {/* Wrap ReactMarkdown in a div with the classes instead of using className prop */}
        <div className="whitespace-pre-wrap break-words">
          <ReactMarkdown
            components={{
              // Style links with your custom colors
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "underline break-words",
                    isUser ? "text-blue-200 hover:text-blue-100" : "text-blue-600 hover:text-blue-500"
                  )}
                >
                  {children}
                </a>
              ),
              // Style bold text with your custom colors
              strong: ({ children }) => (
                <strong className={cn("font-bold", isUser ? "text-blue-200" : "text-primary")}>
                  {children}
                </strong>
              ),
              // Style headings
              h1: ({ children }) => <h1 className="text-2xl font-bold mt-4 mb-2">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl font-bold mt-3 mb-2">{children}</h2>,
              h3: ({ children }) => <h3 className="text-lg font-bold mt-2 mb-1">{children}</h3>,
              // Style paragraphs
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              // Style lists
              ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="ml-4">{children}</li>,
              // Style horizontal rule
              hr: () => <hr className="my-4 border-border" />,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        <p className={cn("text-[10px] mt-2 opacity-60", isUser ? "text-right" : "text-left")}>
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  )
}