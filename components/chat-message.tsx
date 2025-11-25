"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Headphones, User } from "lucide-react"
import ReactMarkdown from "react-markdown"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-3 mb-4", isUser && "flex-row-reverse")}>
      <Avatar className={cn("h-8 w-8", isUser ? "bg-primary" : "bg-muted")}>
        <AvatarImage src={isUser ? "" : "/beatbot-avatar.png"} />
        <AvatarFallback>{isUser ? <User className="h-4 w-4" /> : <Headphones className="h-4 w-4" />}</AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[85%]",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
        )}
      >
        <ReactMarkdown
          components={{
            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
            a: ({ node, ...props }) => (
              <a target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-blue-400" {...props} />
            ),
            ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2" {...props} />,
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  )
}