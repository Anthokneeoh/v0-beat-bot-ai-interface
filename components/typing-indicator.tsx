"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Headphones } from "lucide-react"

export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      <Avatar className="h-8 w-8 shrink-0 ring-2 ring-primary/30">
        <AvatarFallback className="bg-primary text-primary-foreground">
          <Headphones className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>

      <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex gap-1.5 items-center h-5">
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  )
}
