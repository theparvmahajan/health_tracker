"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Quote } from "lucide-react"

const quotes = [
  {
    text: "The only bad workout is the one that didn't happen.",
    author: "Unknown",
  },
  {
    text: "Sleep is the golden chain that ties health and our bodies together.",
    author: "Thomas Dekker",
  },
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn",
  },
  {
    text: "Mental health is not a destination, but a process.",
    author: "Noam Shpancer",
  },
  {
    text: "Your body hears everything your mind says.",
    author: "Naomi Judd",
  },
  {
    text: "The greatest wealth is health.",
    author: "Virgil",
  },
  {
    text: "Wellness is the complete integration of body, mind, and spirit.",
    author: "Greg Anderson",
  },
]

export function MotivationalQuote() {
  const [quote, setQuote] = useState(quotes[0])

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
    setQuote(randomQuote)
  }, [])

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-100 dark:border-purple-900/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Quote className="h-5 w-5 text-purple-500" />
          Daily Inspiration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <blockquote className="italic text-lg font-medium text-purple-900 dark:text-purple-100">
          "{quote.text}"
        </blockquote>
        <p className="text-right text-sm text-muted-foreground mt-2">— {quote.author}</p>
      </CardContent>
    </Card>
  )
}
