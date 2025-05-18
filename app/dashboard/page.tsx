"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SleepTracker } from "@/components/sleep-tracker"
import { FitnessRoutine } from "@/components/fitness-routine"
import { MentalHealthJournal } from "@/components/mental-health-journal"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { MotivationalQuote } from "@/components/motivational-quote"
import { WellnessScore } from "@/components/wellness-score"
import { ProgressSummary } from "@/components/progress-summary"

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)

    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated && mounted) {
      router.push("/")
    }
  }, [router, mounted])

  if (!mounted) return null

  return (
    <DashboardShell>
      <div className="border-b">
        <div className="flex h-16 items-center px-4 container">
          <div className="font-bold text-xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-transparent bg-clip-text">
            Wellness Tracker
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <ModeToggle />
            <UserNav />
          </div>
        </div>
      </div>

      <div className="container py-6">
        <DashboardHeader heading="Your Wellness Dashboard" text="Track, analyze, and improve your overall wellbeing." />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <WellnessScore />
          <ProgressSummary />
          <MotivationalQuote />
        </div>

        <Tabs defaultValue="sleep" className="mt-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="sleep"
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900/20 dark:data-[state=active]:text-purple-300"
            >
              Sleep
            </TabsTrigger>
            <TabsTrigger
              value="fitness"
              className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-900 dark:data-[state=active]:bg-pink-900/20 dark:data-[state=active]:text-pink-300"
            >
              Fitness
            </TabsTrigger>
            <TabsTrigger
              value="mental"
              className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-900 dark:data-[state=active]:bg-orange-900/20 dark:data-[state=active]:text-orange-300"
            >
              Mental Health
            </TabsTrigger>
          </TabsList>
          <TabsContent value="sleep" className="space-y-4 mt-6 animate-fade-in">
            <SleepTracker />
          </TabsContent>
          <TabsContent value="fitness" className="space-y-4 mt-6 animate-fade-in">
            <FitnessRoutine />
          </TabsContent>
          <TabsContent value="mental" className="space-y-4 mt-6 animate-fade-in">
            <MentalHealthJournal />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
