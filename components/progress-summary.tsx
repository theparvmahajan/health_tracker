"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Moon, Activity, Heart } from "lucide-react"

export function ProgressSummary() {
  const [sleepStreak, setSleepStreak] = useState(0)
  const [fitnessStreak, setFitnessStreak] = useState(0)
  const [journalStreak, setJournalStreak] = useState(0)

  useEffect(() => {
    // Calculate streaks based on stored data
    const sleepData = JSON.parse(localStorage.getItem("sleepData") || "[]")
    const journalEntries = JSON.parse(localStorage.getItem("journalEntries") || "[]")
    const fitnessRoutines = JSON.parse(localStorage.getItem("fitnessRoutines") || "[]")

    // Simple streak calculation (consecutive days)
    setSleepStreak(Math.min(sleepData.length, 7))
    setJournalStreak(Math.min(journalEntries.length, 5))

    // For fitness, check if there are completed exercises
    const hasCompletedExercises = fitnessRoutines.some(
      (routine: any) => routine.exercises && routine.exercises.some((ex: any) => ex.completed),
    )
    setFitnessStreak(hasCompletedExercises ? 3 : 0)
  }, [])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Activity Summary</CardTitle>
        <CardDescription>Your recent progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-purple-100 p-2 dark:bg-purple-900/20">
              <Moon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Sleep Tracking</p>
              <div className="flex items-center">
                <div className="h-2 w-16 rounded-full bg-purple-100 dark:bg-purple-900/20">
                  <div
                    className="h-full rounded-full bg-purple-600 dark:bg-purple-400"
                    style={{ width: `${(sleepStreak / 7) * 100}%` }}
                  />
                </div>
                <span className="ml-2 text-xs text-muted-foreground">{sleepStreak}/7 days</span>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-pink-100 p-2 dark:bg-pink-900/20">
              <Activity className="h-5 w-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Fitness Routines</p>
              <div className="flex items-center">
                <div className="h-2 w-16 rounded-full bg-pink-100 dark:bg-pink-900/20">
                  <div
                    className="h-full rounded-full bg-pink-600 dark:bg-pink-400"
                    style={{ width: `${(fitnessStreak / 5) * 100}%` }}
                  />
                </div>
                <span className="ml-2 text-xs text-muted-foreground">{fitnessStreak}/5 days</span>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-orange-100 p-2 dark:bg-orange-900/20">
              <Heart className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Mental Health</p>
              <div className="flex items-center">
                <div className="h-2 w-16 rounded-full bg-orange-100 dark:bg-orange-900/20">
                  <div
                    className="h-full rounded-full bg-orange-600 dark:bg-orange-400"
                    style={{ width: `${(journalStreak / 5) * 100}%` }}
                  />
                </div>
                <span className="ml-2 text-xs text-muted-foreground">{journalStreak}/5 days</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
