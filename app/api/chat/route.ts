import { type NextRequest, NextResponse } from "next/server"

// Poe API integration ready endpoint
// To integrate with Poe API, add your POE_API_KEY to environment variables
// and uncomment the Poe-specific code below

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Simulated response - replace with actual Poe API call
    // For Poe API integration:
    //
    // const response = await fetch("https://api.poe.com/bot/YOUR_BOT_NAME", {
    //   method: "POST",
    //   headers: {
    //     "Authorization": `Bearer ${process.env.POE_API_KEY}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     query: message,
    //     user_id: "user_123",
    //   }),
    // })
    //
    // const data = await response.json()
    // return NextResponse.json({ response: data.text })

    const responses = [
      "Great choice! Based on your interest, I'd recommend checking out artists like LCD Soundsystem, Justice, and Kavinsky. They all have that electronic dance vibe with a retro twist. Want me to create a playlist with these artists?",
      'I love that energy! Here are some tracks that might get you pumped:\n\n1. "Blinding Lights" - The Weeknd\n2. "Levitating" - Dua Lipa\n3. "Don\'t Start Now" - Dua Lipa\n4. "Uptown Funk" - Bruno Mars\n\nShould I add more or explore a different genre?',
      "Amazing taste! Electronic music has so many incredible subgenres. Are you more into house, techno, synthwave, or something more ambient? I can tailor my recommendations based on your mood.",
      "Let me analyze that for you! Based on current trends and your preferences, I think you'd love the new wave of hyperpop and experimental electronic artists. Artists like 100 gecs, SOPHIE, and AG Cook are pushing boundaries. Interested?",
    ]

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    return NextResponse.json({
      response: randomResponse,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
