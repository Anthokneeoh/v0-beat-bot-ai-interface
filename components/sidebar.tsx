"use client"

import { Home, MessageSquare, Settings, X, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { icon: Home, label: "Home", active: true },
  { icon: MessageSquare, label: "Chat History", active: false },
  { icon: Settings, label: "Settings", active: false },
]

const recentChats = [
  { title: "Discover new artists", time: "2h ago" },
  { title: "Summer playlist ideas", time: "Yesterday" },
  { title: "Hip-hop recommendations", time: "3 days ago" },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Close button for mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="p-6 flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
            <Headphones className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground">BeatBot AI</h1>
            <p className="text-xs text-muted-foreground">Your Personal DJ</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                item.active
                  ? "bg-sidebar-accent text-primary"
                  : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Recent chats */}
        <div className="px-4 mt-8">
          <h2 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Recent Chats
          </h2>
          <div className="space-y-1">
            {recentChats.map((chat, index) => (
              <button
                key={index}
                className="w-full flex flex-col items-start px-4 py-3 rounded-lg text-sm transition-colors hover:bg-sidebar-accent/50 group"
              >
                <span className="text-sidebar-foreground font-medium truncate w-full text-left group-hover:text-primary transition-colors">
                  {chat.title}
                </span>
                <span className="text-xs text-muted-foreground">{chat.time}</span>
              </button>
            ))}
          </div>
        </div>

        {/* User profile */}
        <div className="mt-auto p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-sidebar-accent/50 cursor-pointer transition-colors">
            <Avatar className="h-9 w-9 ring-2 ring-primary/30">
              <AvatarImage src="/user-avatar-music.jpg" />
              <AvatarFallback className="bg-primary/20 text-primary">DJ</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Music Lover</p>
              <p className="text-xs text-muted-foreground truncate">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
