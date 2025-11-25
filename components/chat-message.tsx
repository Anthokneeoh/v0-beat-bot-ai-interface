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

