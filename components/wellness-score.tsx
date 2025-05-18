"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function WellnessScore() {
  const [score, setScore] = useState(0)

  useEffect(() => {
    // Calculate a wellness score based on stored data
    const sleepData = JSON.parse(localStorage.getItem("sleepData") || "[]")
    const journalEntries = JSON.parse(localStorage.getItem("journalEntries") || "[]")
    const fitnessRoutines = JSON.parse(localStorage.getItem("fitnessRoutines") || "[]")

    let totalScore = 65 // Base score

    // Add points for sleep data
    if (sleepData.length > 0) {
      const recentSleep = sleepData.slice(-7)
      const avgSleep = recentSleep.reduce((acc: number, entry: any) => acc + entry.hours, 0) / recentSleep.length

      if (avgSleep >= 7 && avgSleep <= 9) {
        totalScore += 15
      } else if (avgSleep >= 6 && avgSleep < 7) {
        totalScore += 10
      }
    }

    // Add points for journal entries
    if (journalEntries.length > 0) {
      totalScore += Math.min(journalEntries.length * 2, 10)
    }

    // Add points for fitness routines
    if (fitnessRoutines.length > 0) {
      const routines = fitnessRoutines[0]?.exercises || []
      const completedExercises = routines.filter((ex: any) => ex.completed).length
      totalScore += Math.min(completedExercises, 10)
    }

    // Ensure score is between 0-100
    totalScore = Math.min(Math.max(totalScore, 0), 100)

    // Animate the score
    let currentScore = 0
    const interval = setInterval(() => {
      currentScore += 2
      setScore(Math.min(currentScore, totalScore))
      if (currentScore >= totalScore) {
        clearInterval(interval)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [])

  const getScoreColor = () => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-blue-500"
    if (score >= 40) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Wellness Score</CardTitle>
        <CardDescription>Your overall wellness rating</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center">
          <div className={`text-5xl font-bold ${getScoreColor()}`}>{score}</div>
          <Progress value={score} className="h-2 mt-2" />
          <p className="text-sm text-muted-foreground mt-2">
            {score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Fair" : "Needs Improvement"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
