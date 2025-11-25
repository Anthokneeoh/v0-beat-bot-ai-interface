import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

// Initialize the client pointing to Poe's URL
const client = new OpenAI({
  apiKey: process.env.POE_API_KEY || "",
  baseURL: "https://api.poe.com/v1",
})

export async function POST(request: NextRequest) {
  try {
    // Validate API key exists
    if (!process.env.POE_API_KEY) {
      return NextResponse.json(
        { error: "POE_API_KEY is not configured" },
        { status: 500 }
      )
    }

    const { message } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    // Call the REAL Poe API
    const chatCompletion = await client.chat.completions.create({
      model: "beatbotzz",
      messages: [{ role: "user", content: message }],
      temperature: 0.7,
    })

    // Extract the message
    const botResponse = chatCompletion.choices[0].message.content

    return NextResponse.json({
      response: botResponse,
      timestamp: new Date().toISOString(),
    })

  } catch (error: any) {
    console.error("Poe API Error:", error)

    // Check if it's a quota/limit issue
    if (error?.status === 429 || error?.code === "insufficient_quota") {
      return NextResponse.json(
        {
          response: "⚠️ **API Limit Reached:** I cannot connect to Poe right now because the free tier quota has been exceeded. Please try again later.",
        },
        { status: 200 }
      )
    }

    // Check for authentication errors
    if (error?.status === 401 || error?.status === 403) {
      return NextResponse.json(
        {
          response: "⚠️ **Authentication Error:** Invalid API key. Please check your POE_API_KEY configuration.",
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      {
        error: "Failed to connect to Poe API",
        details: error.message,
      },
      { status: 500 }
    )
  }
}