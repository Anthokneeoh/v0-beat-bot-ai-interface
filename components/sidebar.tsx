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