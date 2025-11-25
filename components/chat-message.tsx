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
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {isUser ? (
            <div className="whitespace-pre-wrap break-words">{message.content}</div>
          ) : (
            <ReactMarkdown
              components={{
                a: ({ node, children, href, ...props }) => (
                  <a
                    {...props}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 underline font-semibold transition-colors inline-block my-1"
                  >
                    {children}
                  </a>
                ),
                h1: ({ node, ...props }) => (
                  <h1 {...props} className="text-xl font-bold mt-4 mb-3" />
                ),
                h2: ({ node, ...props }) => (
                  <h2 {...props} className="text-lg font-bold mt-4 mb-3" />
                ),
                h3: ({ node, ...props }) => (
                  <h3 {...props} className="text-base font-bold mt-3 mb-2" />
                ),
                p: ({ node, children, ...props }) => {
                  // Convert children to string to check content
                  const content = String(children)

                  // If this paragraph contains "Why:" add extra spacing
                  if (content.includes('Why:')) {
                    return (
                      <p {...props} className="my-3 leading-relaxed pl-4 border-l-2 border-primary/30">
                        {children}
                      </p>
                    )
                  }

                  return (
                    <p {...props} className="my-2 leading-relaxed">
                      {children}
                    </p>
                  )
                },
                strong: ({ node, ...props }) => (
                  <strong {...props} className="font-bold text-foreground" />
                ),
                ul: ({ node, ...props }) => (
                  <ul {...props} className="list-disc list-inside my-3 space-y-2" />
                ),
                ol: ({ node, ...props }) => (
                  <ol {...props} className="list-decimal list-inside my-3 space-y-3" />
                ),
                li: ({ node, ...props }) => (
                  <li {...props} className="my-2 leading-relaxed" />
                ),
                hr: ({ node, ...props }) => (
                  <hr {...props} className="my-4 border-border" />
                ),
                code: ({ node, inline, ...props }) =>
                  inline ? (
                    <code {...props} className="bg-secondary px-1 py-0.5 rounded text-sm" />
                  ) : (
                    <code {...props} className="block bg-secondary p-2 rounded my-2" />
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
              "text-xs opacity-70 mt-2",
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