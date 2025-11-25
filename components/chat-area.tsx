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

    // Simulate AI response (ready for Poe API integration)
    setTimeout(() => {
      const aiResponses = [
        "Great choice! Based on your interest, I'd recommend checking out artists like LCD Soundsystem, Justice, and Kavinsky. They all have that electronic dance vibe with a retro twist. Want me to create a playlist with these artists?",
        'I love that energy! Here are some tracks that might get you pumped:\n\n1. "Blinding Lights" - The Weeknd\n2. "Levitating" - Dua Lipa\n3. "Don\'t Start Now" - Dua Lipa\n4. "Uptown Funk" - Bruno Mars\n\nShould I add more or explore a different genre?',
        "Amazing taste! Electronic music has so many incredible subgenres. Are you more into house, techno, synthwave, or something more ambient? I can tailor my recommendations based on your mood.",
        "Let me analyze that for you! Based on current trends and your preferences, I think you'd love the new wave of hyperpop and experimental electronic artists. Artists like 100 gecs, SOPHIE, and AG Cook are pushing boundaries. Interested?",
      ]

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt)
  }

  return (
    <main className="flex-1 flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 ml-12 lg:ml-0">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Headphones className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">BeatBot AI - Your Personal DJ</h2>
            <p className="text-xs text-muted-foreground">AI-powered Spotify recommendations</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">AI Powered</span>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested prompts - only show when minimal messages */}
      {messages.length <= 1 && (
        <div className="px-4 pb-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs text-muted-foreground mb-3 text-center">Try asking:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptClick(prompt)}
                  className="px-4 py-2 text-sm rounded-full bg-secondary hover:bg-primary/20 hover:text-primary text-secondary-foreground transition-colors border border-border/50 hover:border-primary/30"
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
